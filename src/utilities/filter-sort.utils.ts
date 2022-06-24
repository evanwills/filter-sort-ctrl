import { html, TemplateResult } from 'lit';
// import { customElement, property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import { UBoolState, FEventHandler, IDbEnum, IListCtrlOptionItem } from '../types/Igeneral';

import { isInt, isNumber } from './validation';
// import { isoStrToTime } from './utilities/sanitise';
import { getBoolState } from './general.utils';
import { IFilterSortCtrl } from '../types/IFilterSortCtrl';


/**
 * Parse a string for options that can be used in an option filter
 *
 * @param input String with the patter: [number:label,]
 *
 * @returns List of objects that can be used
 */
export const parseOptStr = (input : string) : Array<IDbEnum> => {
  const regex = /(?<=^|,)([0-9]+):(.*?)(?=,[0-9]|$)/ig;
  let match: RegExpExecArray|null;
  const output : Array<IDbEnum>= [];

  while ((match = regex.exec(input as string)) !== null) {
    if (isNumber(match[1])) {
      const opt : IDbEnum = {
        id: parseInt(match[1]),
        name: match[2],
        description: ''
      }

      output.push(opt);
    }
  }

  return output;
}

export const incIgnoreExc = (
  id: string,
  value: number,
  handler : FEventHandler,
  childID: number|undefined = undefined,
  inc: string = 'Include',
  exc: string = 'Exclude'
) : TemplateResult  => {
  // console.group('_incIgnoreExc()')
  // console.log('id:', id)
  // console.log('value:', value)
  // console.log('isInt(value):', isInt(value))
  // console.log('field:', field)
  // console.log('data.stateData:', data.stateData)
  const _dataType : string = (typeof childID === 'number')
    ? 'option'
    : 'bool';
  // console.groupEnd();
  return html`
    <ul class="radio-list__wrap radio-list__wrap--short">
      <li class="radio-list__item">
        <input type="radio"
               name="${id}"
               id="${id}__0"
               class="radio-list__input"
               value="0"
               data-type="${_dataType}"
               data-child-id="${ifDefined(childID)}"
              ?checked=${!isInt(value) || value === 0}
              @change=${handler} />
        <label for="${id}__0" class="radio-list__label radio-list__label--short">
          Ignore
        </label>
      </li>
      <li class="radio-list__item">
        <input type="radio"
               name="${id}"
               id="${id}__1"
               class="radio-list__input"
               value="1"
               data-type="${_dataType}"
               data-child-id="${ifDefined(childID)}"
              ?checked=${value > 0}
              @change=${handler} />
        <label for="${id}__1" class="radio-list__label radio-list__label--short">
          ${inc}
        </label>
      </li>
      <li class="radio-list__item">
        <input type="radio"
               name="${id}"
               id="${id}__-1"
               class="radio-list__input"
               value="-1"
               data-type="${_dataType}"
               data-child-id="${ifDefined(childID)}"
              ?checked=${value < 0}
              @change=${handler} />
        <label for="${id}__-1" class="radio-list__label radio-list__label--short">
          ${exc}
        </label>
      </li>
    </ul>`;
}

export const getOptMode = (
  id: number, filters: Array<IListCtrlOptionItem>
) : UBoolState => {
  const filter = filters.filter((item: IListCtrlOptionItem) => (item.id === id));
  return (filter.length === 1)
    ? filter[0].mode
    : 0
}

export const getOption = (
  id: string,
  option: IDbEnum,
  filters: Array<IListCtrlOptionItem>,
  handler : FEventHandler,
  inc: string = 'Include',
  exc: string = 'Exclude'
) : TemplateResult => {
  const val = getOptMode(option.id, filters);
  return html`
    <li>
      ${option.name}:
      ${incIgnoreExc(id + '__' + option.id , val, handler, option.id, inc, exc)}
    </li>
  `
}

export const getOptions = (
  id: string,
  options: Array<IDbEnum>,
  filteredOptions: Array<IListCtrlOptionItem>,
  handler: FEventHandler,
  inc: string = 'Include',
  exc: string = 'Exclude'
) : TemplateResult => {
  return html`
    <ul>
      ${options.map((option : IDbEnum) => getOption(id, option, filteredOptions, handler, inc, exc))}
    </ul>
  `;
}


export const getUpdatedFilterOpt = (
  filteredOptions : Array<IListCtrlOptionItem>,
  input : HTMLInputElement
) : Array<IListCtrlOptionItem> => {
  let childID = (typeof input.dataset.childId !== 'undefined')
    ? parseInt(input.dataset.childId)
    : -1;

  return filteredOptions.map((item : IListCtrlOptionItem) : IListCtrlOptionItem => {
    return (item.id === childID)
      ? { ...item, mode: getBoolState(input.value) }
      : item;
  });
}

export const getOptStr = (filteredOptions : Array<IListCtrlOptionItem>) : string => {
  let output = '';
  let sep = '';

  console.group('_getOptStr()')

  for (let a = 0; a < filteredOptions.length; a += 1) {
    if (filteredOptions[a].mode !== 0) {
      output += sep + filteredOptions[a].id + ':' + filteredOptions[a].mode;
      sep = ',';
      console.log('output:', output);
    }
  }
  console.log('output:', output);
  console.groupEnd();

  return output;
}


export const helpTxt = () : TemplateResult => {
  return html`
    <ul class="help-block">
      <li>To filter on multiple text fragments, separate each fragment with a semicolon <code>;</code></li>
      <li>To only match from the start, use a caret <code>^</code> at the start of the fragment</li>
      <li>To only match the end, use a dollar sign <code>$</code> at the end of the fragment</li>
      <li>To exclude matched items, preceed your fragment with a exclamation mark <code>!</code> at the end of the fragment</li>
    </ul>
  `;
}

export const getInput = (
  id: string, label: string, value : string|number, field: string, data: IFilterSortCtrl, handler: FEventHandler
) : TemplateResult => {
  const _id = id + '__' + field;
  let _type = data.dataType;
  let _value = value;
  let _special : TemplateResult|string = '';

  if (value === 'auto') {
    switch (field) {
      case 'filter':
        _value = data.filter;
        break;
      case 'bool':
        _value = data.bool;
        break;
    }
  }
  // console.group('_getInput()')
  // console.log('_value:', _value)
  // console.log('_type:', _type)
  // console.log('_id:', _id)

  switch (data.dataType) {
    case 'date':
      _value = (isInt(value) && value > 0)
        ? new Date(value as number).toISOString()
        : '';
      _type = 'date';
      break;

    case 'datetime':
      _value = (isInt(value) && value > 0)
        ? new Date(value as number).toISOString()
        : '';
      _type = 'datetime-local';
      break;

    case 'bool':
      _special = incIgnoreExc(_id, _value as number, handler);
      break;

    case 'option':
      // console.log('data.options:', data.options)
      _special = getOptions(
        _id,
        data.options as Array<IDbEnum>,
        data.filteredOptions,
        handler
      );
      break;
  }
  // console.log('_type:', _type)
  // console.groupEnd();

  return html`
    <li>
      <label for="${_id}" class="filter-label">${label}:</label>
      ${(_special === '')
        ? html`<input id="${_id}"
                      type="${_type}"
                      value="${_value}"
                      data-type="${field}"
                     @keyup=${handler}
                     @change=${handler}
                      class="filter-input" />`
        : _special
      }
    </li>
  `;
}

export const getToggleInput = (
  id : string,
  name : string,
  isChecked : boolean,
  trueTxt : string,
  falseTxt : string,
  handler : FEventHandler,
  title : string|undefined = undefined) : TemplateResult => {
  return html`
    <li>
      <span class="cb-btn__wrap">
        <input
          type="checkbox"
          class="cb-btn__input"
          id="${id}__${name}"
        ?checked="${isChecked}"
        @change=${handler}
          data-type="${name}"
        />
        <label
          for="${id}__${name}"
          class="cb-btn__label"
          title="${ifDefined(title)}"
          >${(isChecked) ? trueTxt : falseTxt}</label>
      </span>
    </li>
  `;
}
