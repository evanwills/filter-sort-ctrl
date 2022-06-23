import { html, css, LitElement, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import { UBoolState, FEventHandler, IDbEnum, IListCtrlItem, IListCtrlOptionItem } from './types/Igeneral';

import { srOnly } from './css/sr-only.css';
import { radioList } from './css/radio-list.css';

import { isInt } from './utilities/validation';
import { isoStrToTime } from './utilities/sanitise';
import { getBoolState } from './utilities/general.utils';



/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('filter-sort-ctrl')
export class FilterSortCtrl extends LitElement {
  /**
   * Label for input (to show the user what the input is for)
   */
  @property({ type: String })
  action : string = '';

  /**
   * Type of data being filtered
   *
   * * text [default]
   * * number   - number field (min/max)
   * * date     - date only field (min/max)
   * * datetime - full date time field (min/max)
   * * bool     - Checkbox field (include/exclude/ignore)
   * * option   - Select/Radio field (mulit include/exclude/ignore)
   */
  @property({ type: String })
  dataType : string = 'text';

  /**
   * Which bit of state is being filtered
   */
  @property({ type: String })
  stateSlice : string = '';

  /**
   * Name of the column being filtered
   */
  @property({ type: String })
  colName : string = '';

  /**
   * Order in which items are listed
   *
   * * -1 = Decending
   * * 1  = Ascending
   * * 0  = Not ordered by this column
   */
  @property({ type: Number })
  order : number = 0;

  /**
   * For option filters childID is the ID of the option that was
   * last changed
   */
  @property({ type: Number, reflect: true })
  childID : number = 0;

  /**
   * Value on which to filter text fields
   */
  @property()
  filter : string|number = '';

  /**
   * For numeric, date & date/time fields the minimum value to be
   * included in the filtered output
   */
  @property({ type: Number })
  min : number = 0;

  /**
   * For numeric, date & date/time fields the maximum value to be
   * included in the filtered output
   */
  @property({ type: Number })
  max : number = 0;

  /**
   * State of a boolean filter
   * * 0 = ignore
   * * 1 = include if TRUE
   * * -1 = exclude if TRUE
   */
  @property({ type: Number })
  bool : UBoolState = 0;

  /**
   * Whether or not to use min & max filters or simple
   * (single value) number filter
   */
  @property({ type: Boolean })
  showMinMax : boolean = false;

  /**
   * Predefined state of component (usually from Redux state)
   */
  @property()
  stateData : IListCtrlItem|null = null;

  /**
   * List of fixed options in present in the field being
   * filtered/sorted
   */
  @property()
  options : Array<IDbEnum> = [];

  /**
   * Value to be used when a change action is triggered
   */
  @property({ reflect: true })
  value : string|number = '';

  /**
   * Whether or not the component is expanded
   */
  @property({ type: Boolean })
  expanded : boolean = false;

  /**
   * Whether or not the component is expanded
   */
  @property({ type: Boolean })
  alwaysExpanded : boolean = false;

  /**
   * For fixed option fields, whether to sort by the option value
   * (or option label *[default]*)
   */
  @property({ type: Boolean })
  sortByValue : boolean = false;

  /**
   * Whether or not initialiasation code still needs to be executed
   */
  @state()
  doInit : boolean = true;

  // private oldMin : string = '';
  // private oldMax : string = '';
  private oldOpt : string = '';
  private filteredOptions : Array<IListCtrlOptionItem> = [];
  private _handler : FEventHandler|null = null

  static styles = css`
    :host {
      --bg-colour: #1b1b1b;
      --btn-padding-top: 1.3rem;
      --over-colour: rgba(0, 0, 0, 0.85);
      --over-colour--rev: rgba(255, 255, 255, 0.85);
      --text-colour: #fff;
      --trans-speed: 0.3s;
    }
    ${srOnly}
    .wrap {
      background-color: var(--bg-colour);
      color: var(--text-colour);
      left: 50%;
      max-width: 35rem;
      opacity: 0;
      padding: 2rem;
      position: fixed;
      text-align: left;
      top: 50%;
      transform: scale(0) translate(-50%, -50%);
      transition: opacity ease-in-out var(--trans-speed) 0.15s,
                  height ease-in-out var(--trans-speed) 0.15s,
                  transform ease-in-out var(--trans-speed) 0.15s;
      transform-origin: 0 0;
      z-index: 100;
      width: calc(100% - 2rem);
    }
    button:hover {
      cursor: pointer;
    }
    h3 {
      margin: 0 0 0.5rem;
    }
    .wrap--show {
      opacity: 1;
      transform: scale(1) translate(-50%, -50%);
    }
    .bg-close {
      background-color: var(--over-colour);
      border-radius; 30rem;
      border: none;
      bottom: 0;
      height: 100%;
      left: 0;
      right: 0;
      opacity: 0;
      position: fixed;
      top: 0;
      transform: scale(0);
      transition: opacity ease-in-out var(--trans-speed),
                  transform ease-in-out var(--trans-speed);
      width: 100%;
      z-index: 99
    }
    .bg-close--show {
      opacity: 1;
      transform: scale(1);
      z-index: 99
    }
    .btn-open {
      background-color: transparent;
      border: none;
      color: var(--text-colour);
      display: inline-block;
      font-size: 1rem;
      font-weight: bold;
      padding: 0.75rem 2.5rem 0.75rem 2rem;
      position: relative;
      width: 100%;
    }
    ::slotted(*) {
      font-weight: bold;
    }
    .btn-open::before {
      content: '\u22EE';
      display: inline-block;
      font-size: 1.3rem;
      padding: 0.4rem 1rem;
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-52%);
    }
    .btn-close {
      background-color: var(--text-colour);
      border-radius: 1rem;
      border: none;
      color: var(--bg-colour);
      display: inline-block;
      font-weight: bold;
      height: 1.5rem;
      line-height: 0.25rem;
      position: absolute;
      right: -0.5rem;
      top: -0.5rem;
      width: 1.5rem;
    }
    .btn-close::before {
      bottom: 0.05rem;
      content: '\u2717';
      position: relative;
    }
    .sort-btn {
      background-color: var(--text-colour);
      border: none;
      display: block;
      font-weight: bold;
      height: 1.25rem;
      justify-self: end;
      padding: 0.5rem;
      width: 1.5rem;
    }
    .sort-btn::before {
      content: ">";
      position: absolute;
      transform-origin: 100% 50%;
    }
    .ascending {
      align-self: end;
      border-bottom: 0.05rem solid var(--bg-colour);
      border-top-left-radius: 1rem;
      border-top-right-radius: 1rem;
      grid-area: sort-up;
      padding: 0.5rem 0.5rem 0.2rem 0.5rem;
    }
    .ascending::before {
      transform: rotate(-90deg) translate(140%, -75%) scaleY(1.75);
    }
    .decending {
      align-self: top;
      border-bottom-left-radius: 1rem;
      border-bottom-right-radius: 1rem;
      border-top: 0.05rem solid var(--bg-colour);
      grid-area: sort-down;
      padding: 0.5rem 0.5rem 0.2rem 0.5rem;
    }
    .decending::before {
      transform: rotate(90deg) translate(-35%, 59%) scaleY(1.75);
    }
    .fields {
      align-self: center;
      display: grid;
      grid-template-areas: 'fields sort-up'
                           'fields sort-down';
      grid-template-columns: 1fr 2.5rem;
      width: 100%;
    }
    .fields--help {
      grid-template-areas: 'fields  sort-up'
                           'fields sort-down'
                           ' help      .';
    }
    .fields .fields-list {
      grid-area: fields;
      list-style-type: none;
      padding: 0;
      margin: 0.5rem 0;
    }
    .fields li {
      margin-top: 0.5rem;
    }
    .fields label {
      display: inline-block;
      width: 5rem;
    }
    .fields input[type=text] {
      display: inline-block;
      width: calc(100% - 6rem);
    }
    .help-block {
      font-weight: normal;
      grid-area: help;
    }
    code {
      background-color: var(--over-colour);
      border: 0.05rem solid var(--over-colour--rev);
      padding: 0.2rem 0.3rem;
    }
    ${radioList()}
  `;


  /**
   * Do some initialisation before we do the first render
   */
  private _init() {
    let tmp : Array<IListCtrlOptionItem> = [];

    this.dataset.datatype = (typeof this.dataset.datatype === 'string')
      ? this.dataset.datatype
      : 'text';

    this.dataType = this.dataset.datatype;

    // See if we have any predefined state
    if (this.stateData !== null) {
      this.dataset.subtype = this.stateData.field;
      this.filter = this.stateData.filter
      this.max = this.stateData.max
      this.max = this.stateData.max
      this.order = this.stateData.order
      this.bool = this.stateData.bool
      tmp = this.stateData.options
    }

    if (this.dataType === 'option') {
      this.filteredOptions = this.options.map(
        (option: IDbEnum) : IListCtrlOptionItem => {
          return {
            id: option.id,
            mode: this._getOptMode(option.id, tmp)
          }
        }
      );
    }

    this._handler = this._getInputHandler
  }

  /**
   * Handle opening & closing the main user interface for this
   * component
   *
   * @param _e Dom Event that triggered the call to this method
   */
  private _toggleExpanded(_e : Event): void {
    this.expanded = !this.expanded
  }

  private _getInputHandler(e : Event) : void {
    const input = e.target as HTMLInputElement;
    let ok = false;
    console.group('_getInputHandler()')
    console.log('this:', this);
    console.log('this.dataType:', this.dataType);
    console.log('input:', input);
    console.log('input.value:', input.value);
    console.log('input.dataset.type:', input.dataset.type);
    let val = 0;

    switch (input.dataset.type) {
      case 'filter':
        if (this.filter !== input.value) {
          this.filter = input.value;
          this.value = input.value;
          ok = true;
          this.dataset.subtype2 = 'filter';
        }
        break;

      case 'min':
        val = (this.dataType === 'number')
          ? parseInt(input.value)
          : isoStrToTime(input.value);

        if (this.min !== val) {
          this.min = val;
          this.value = val;
          ok = true;
          this.dataset.subtype2 = 'min';
        }
        break;

      case 'max':
        val = (this.dataType === 'number')
          ? parseInt(input.value)
          : isoStrToTime(input.value);

        if (this.dataType === 'date') {
          // When filtering on date alone, we want max to
          // include the day specified by the date, so we'll
          // add 24 hours worth of seconds to make sure the
          // filter works as expected
          this.max += 86399;
        }

        if (this.max !== val) {
          this.max = val;
          this.value = val;
          ok = true;
          this.dataset.subtype2 = 'max';
        }
        break;

      case 'bool':
        const tmpB = getBoolState(input.value);
        if (this.bool !== tmpB) {
          this.value = tmpB;
          this.bool = tmpB;
          ok = true;
          this.dataset.subtype2 = 'bool';
        }
        break;

      case 'option':
        const tmpO = this._getOptStr(input);
          if (this.oldOpt !== tmpO) {
            this.value = tmpO;
            ok = true;
            this.dataset.subtype2 = 'option';
          }
        break;

      case 'up':
        this.order = (this.order !== -1)
          ? -1
          : 0;
        this.dataset.subtype2 = 'order';
        this.value = this.order;
        ok = true;
        break;

      case 'down':
        this.order = (this.order !== 1)
          ? 1
          : 0;
        this.dataset.subtype2 = 'order';
        this.value = this.order;
        ok = true;
        break;
    }

    if (ok === true) {
      this.dispatchEvent(
        new Event('change', { bubbles: true, composed: true })
      )
    }
    console.log('this:', this)
    console.log('this.dataset:', this.dataset)
    console.groupEnd();
  }

  private _getOptStr(input: HTMLInputElement) : string {
    let childID = (typeof input.dataset.childId !== 'undefined')
      ? parseInt(input.dataset.childId)
      : -1;

    console.group('_getOptStr()')
    console.log('childID:', childID)
    console.log('input.value:', input.value)
    console.log('input.dataset:', input.dataset)
    console.log('this.filteredOptions:', this.filteredOptions)

    this.filteredOptions = this.filteredOptions.map((item : IListCtrlOptionItem) : IListCtrlOptionItem => {
      return (item.id === childID)
        ? { ...item, mode: getBoolState(input.value) }
        : item;
    });
    console.log('this.filteredOptions:', this.filteredOptions)

    let output = '';
    let sep = '';
    for (let a = 0; a < this.filteredOptions.length; a += 1) {
      if (this.filteredOptions[a].mode !== 0) {
        output += sep + this.filteredOptions[a].id + ':' + this.filteredOptions[a].mode;
        sep = ',';
        console.log('output:', output);
      }
    }
    console.log('output:', output);
    console.groupEnd();
    return output;
  }

  private _incIgnoreExc(id: string, value: number, handler : FEventHandler, childID: number|undefined = undefined) : TemplateResult {
    // console.group('_incIgnoreExc()')
    // console.log('id:', id)
    // console.log('value:', value)
    // console.log('isInt(value):', isInt(value))
    // console.log('field:', field)
    // console.log('this.stateData:', this.stateData)
    const _dataType : string = (typeof childID === 'number')
      ? 'option'
      : 'bool';
    // console.groupEnd();
    return html`
      <ul class="radio-list__wrap radio-list__wrap--short">
        <li>
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
        <li>
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
            Include
          </label>
        </li>
        <li>
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
            Exclude
          </label>
        </li>
      </ul>`;
  }

  private _getOptMode = (id: number, filters: Array<IListCtrlOptionItem>) : UBoolState => {
    const filter = filters.filter((item: IListCtrlOptionItem) => (item.id === id));
    return (filter.length === 1)
      ? filter[0].mode
      : 0
  }

  private _getOption = (id: string, option: IDbEnum, filters: Array<IListCtrlOptionItem>, handler : FEventHandler) : TemplateResult => {
    const val = this._getOptMode(option.id, filters);
    return html`
      <li>
        ${option.name}:
        ${this._incIgnoreExc(id + '__' + option.id , val, handler, option.id)}
      </li>
    `
  }

  private _getOptions(
    id: string, options: Array<IDbEnum>, filteredOptions: Array<IListCtrlOptionItem>, handler: FEventHandler
  ) : TemplateResult {
    return html`
      <ul>
        ${options.map((option : IDbEnum) => this._getOption(id, option, filteredOptions, handler))}
      </ul>
    `;
  }

  private _getInput(
    id: string, label: string, value : string|number, field: string
  ) : TemplateResult {
    const _id = id + '__' + field;
    let _type = this.dataType;
    let _value = value;
    let _special : TemplateResult|string = '';

    if (value === 'auto') {
      switch (field) {
        case 'filter':
          _value = this.filter;
          break;
        case 'bool':
          _value = this.bool;
          break;
      }
    }
    // console.group('_getInput()')
    // console.log('_value:', _value)
    // console.log('_type:', _type)
    // console.log('_id:', _id)

    switch (this.dataType) {
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
        _special = this._incIgnoreExc(_id, _value as number, this._getInputHandler);
        break;

      case 'option':
        // console.log('this.options:', this.options)
        _special = this._getOptions(_id, this.options, this.filteredOptions, this._getInputHandler);
        break;
    }
    // console.log('_type:', _type)
    // console.groupEnd();

    return html`
      <li>
        <label for="${_id}">${label}:</label>
        ${(_special === '')
          ? html`<input id="${_id}" type="${_type}" value="${_value}" data-type="${field}" @keyup=${this._handler} @change=${this._handler} />`
          : _special
        }
      </li>
    `
  }

  helpTxt() : TemplateResult {
    return html`
      <ul class="help-block">
        <li>To filter on multiple text fragments, separate each fragment with a semicolon <code>;</code></li>
        <li>To only match from the start, use a caret <code>^</code> at the start of the fragment</li>
        <li>To only match the end, use a dollar sign <code>$</code> at the end of the fragment</li>
        <li>To exclude matched items, preceed your fragment with a exclamation mark <code>!</code> at the end of the fragment</li>
      </ul>
    `;
  }


  /**
   * Render everything for this element
   *
   * @returns
   */
  render () : TemplateResult {
    if (this.doInit === true) {
      this.doInit = false;
      this._init();
    }
    const id = this.stateSlice + '__' + this.dataType;
    let decClass = '';
    let decLabel : string = 'Decending';
    let ascClass = '';
    let ascLabel : string = 'Ascending';
    if (this.order < 0) {
      decClass = ' decending-true';
      decLabel = 'Sorted by decending Order'
    } else if (this.order > 0) {
      decClass = ' ascending-true';
      decLabel = 'Sorted by ascending Order'
    }
    let helpBlock : TemplateResult|string = '';
    let helpClass : string = '';

    const state = (this.expanded)
      ? 'show'
      : 'hide';
    const btnTxt = html`
      <span class="sr-only">
        ${(this.expanded) ? 'Hide' : 'Show'} ${this.colName} filter controls
      </span>`;

    // if (this.dataType === 'text') {
    //   helpClass = ' fields--help';
    //   helpBlock = helpTxt();
    // }

    // console.group('render()')
    // console.log('this:', this)
    // console.log('this.colName:', this.colName)
    // console.log('this.stateData:', this.stateData)
    // console.log('this.options:', this.options)
    // console.groupEnd()

    return html`
      <div class="th">
        <button @click=${this._toggleExpanded} class="btn-open">
          <slot></slot>
          <span class="sr-only">${btnTxt}</span>
        </button>
      </th>
      <div class="wrap wrap--${state}" aria-hidden="${!this.expanded}">
        <button class="btn-close" @click=${this._toggleExpanded}>${btnTxt}</button>
        <h3 id="${id}--grp-label">Filter and sort: ${this.colName}</h3>
        <div role="group" aria-labelledby="${id}--grp-label" class="fields${helpClass}">
          <ul class="fields-list">
            ${(this.showMinMax)
              ? [
                  this._getInput(id, 'Minimum', this.min, 'min'),
                  this._getInput(id, 'Maximum', this.max, 'max')
                ]
              : this._getInput(id, 'Filter by', 'auto', 'filter')}
          </ul>
          ${helpBlock}
          <button class="sort-btn ascending${ascClass}"
                  data-type="up"
                 @click=${this._handler}>
            <span class="sr-only">${ascLabel}</span>
          </button>
          <button class="sort-btn decending${decClass}"
                  data-type="down"
                 @click=${this._handler}>
            <span class="sr-only">${decLabel}</span>
          </button>
        </div>
      </div>
      <button class="bg-close bg-close--${state}" @click=${this._toggleExpanded}>${btnTxt}</button>
    `
  }
}



declare global {
  interface HTMLElementTagNameMap {
    'filter-sort-ctrl': FilterSortCtrl
  }
}
