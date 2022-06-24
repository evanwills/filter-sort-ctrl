import { html, LitElement, TemplateResult, CSSResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
// import { ifDefined } from 'lit/directives/if-defined.js';

import { UBoolState, IDbEnum, IListCtrlItem, IListCtrlOptionItem } from './types/Igeneral';

import { style } from './css/styles.css';

// import { isInt, isNumber, isStr } from './utilities/validation';
import { isoStrToTime } from './utilities/sanitise';
import { getBoolState } from './utilities/general.utils';
import { getInput, getOptMode, getOptStr, getUpdatedFilterOpt, getToggleInput, parseOptStr } from './utilities/filter-sort.utils';
import { IFilterSortCtrl } from './types/IFilterSortCtrl';



/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('filter-sort-ctrl')
export class FilterSortCtrl extends LitElement implements IFilterSortCtrl {
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
  childID : number = -1;

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
  options : Array<IDbEnum>|string = [];

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
  public filteredOptions : Array<IListCtrlOptionItem> = [];

  static styles : CSSResult = style


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
      if (typeof this.options === 'string') {
        this.options = parseOptStr(this.options);
      }

      this.filteredOptions = (this.options as Array<IDbEnum>).map(
        (option: IDbEnum) : IListCtrlOptionItem => {
          return {
            id: option.id,
            mode: getOptMode(option.id, tmp)
          }
        }
      );
    }
  }

  /**
   * Handle opening & closing the main user interface for this
   * component
   *
   * If appropriate dispatch a "change" action for the client to
   * handle
   *
   * @param _e Dom Event that triggered the call to this method
   */
  private _toggleExpanded(_e : Event): void {
    this.expanded = !this.expanded
  }

  /**
   * Handle user interaction with filter controls
   *
   * @param e Event triggered by user interaction
   *
   * @returns
   */
  private _handler(e : Event) : void {
    const input = e.target as HTMLInputElement;
    let ok = false;
    console.group('_handler()')
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
        this.filteredOptions = getUpdatedFilterOpt(this.filteredOptions, input);
        const tmpO = getOptStr(this.filteredOptions);
          if (this.oldOpt !== tmpO) {
            this.value = tmpO;
            ok = true;
            this.dataset.subtype2 = 'option';
            this.oldOpt = tmpO;
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

      case 'toggle-min-max':
        this.showMinMax = !this.showMinMax;
        break;

      case 'toggle-date':
        this.dataType = (this.dataType === 'date')
          ? 'datetime'
          : 'date';
    }

    if (ok === true) {
      this.dispatchEvent(
        new Event('change', { bubbles: true, composed: true })
      )
    }
    console.log('this:', this)
    console.log('this.dataset:', this.dataset)
    console.log('this.value:', this.value);
    console.groupEnd();
  }

  private _renderUI(id : string) : TemplateResult {
    let helpBlock : TemplateResult|string = '';
    let helpClass : string = '';
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
    let toggleMinMax = false;
    let toggleFullDate = false;
    let allowMinMax = false;

    switch (this.dataType) {
      case 'number':
        allowMinMax = true;
        toggleMinMax = true;
        break;

      case 'date':
      case 'datetime':
        allowMinMax = true;
        toggleFullDate = true;
        toggleMinMax = true;
    }

    const fields : Array<TemplateResult> = (allowMinMax === true && this.showMinMax)
      ? [
          getInput(id, 'Minimum', this.min, 'min', this, this._handler),
          getInput(id, 'Maximum', this.max, 'max', this, this._handler)
        ]
      : [getInput(id, 'Filter by', 'auto', 'filter', this, this._handler)];

    if (toggleMinMax) {
      fields.push(
        getToggleInput(
          id,
          'toggle-min-max',
          this.showMinMax,
          'Filter on Min and/or Max',
          'Filter on single value',
          this._handler
        )
      );
    }
    if (toggleFullDate) {
      fields.push(
        getToggleInput(
          id,
          'toggle-date',
          (this.dataType === 'datetime'),
          'Filter on full date/time',
          'Filter on short date',
          this._handler
        )
      );
    }
    // if (this.dataType === 'text') {
    //   helpClass = ' fields--help';
    //   helpBlock = helpTxt();
    // }

    return html`
      <h3 id="${id}--grp-label">Filter and sort: ${this.colName}</h3>
      <div role="group" aria-labelledby="${id}--grp-label" class="fields${helpClass}">
        <ul class="fields-list">
          ${fields}
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
      </div>`;
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

    const state = (this.expanded)
      ? 'show'
      : 'hide';
    const btnTxt = html`
      <span class="sr-only">
        ${(this.expanded) ? 'Hide' : 'Show'} ${this.colName} filter controls
      </span>`;

    const ui = this._renderUI(id)


    // console.group('render()')
    // console.log('this:', this)
    // console.log('this.colName:', this.colName)
    // console.log('this.stateData:', this.stateData)
    // console.log('this.options:', this.options)
    // console.groupEnd()

    return (!this.alwaysExpanded)
      ? html`
          <div class="th">
            <button @click=${this._toggleExpanded} class="btn-open">
              <slot></slot>
              <span class="sr-only">${btnTxt}</span>
            </button>
          </th>
          <div class="wrap wrap--${state}" aria-hidden="${!this.expanded}">
            <button class="btn-close" @click=${this._toggleExpanded}>${btnTxt}</button>
            ${ui}
          </div>
          <button class="bg-close bg-close--${state}" @click=${this._toggleExpanded}>${btnTxt}</button>
        `
      : ui
  }
}



declare global {
  interface HTMLElementTagNameMap {
    'filter-sort-ctrl': FilterSortCtrl
  }
}
