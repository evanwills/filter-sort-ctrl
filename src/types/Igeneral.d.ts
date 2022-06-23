import { TemplateResult } from 'lit';
import { TabAccordion } from '../view/customElements/tab-accordion';
import { IAction, IBaseStateItem } from './Iredux-extra';

/// <reference types="vite/client" />

export type UScalar = string | number | boolean;
export type UScalarA = string | number | boolean | Array<UScalar>;
export type UScalarX = string | number | boolean | IObjScalarX | Array<string> | Array<any>;

export interface IKeyValueStr {
  key: string,
  value: string
}
export interface IKeyValueNum {
  key: string,
  value: number
}
export interface IKeyValueScalar {
  key: string,
  value: UScalar
}

export interface IDbEnum {
  id: number,
  name: string,
  description: string
}

export interface IChildItem {
  id: number,
  name: string,
  disabled?: boolean
}
export interface IOneToMany extends IChildItem {
  id: number,
  name: string,
  children: Array<IChildItem>
}

/**
 * Generic (flat) list of key value pairs usually used for final
 * level of state
 */
export interface IObjScalar {
  [index: string]: UScalar
}
/**
 * List of key/value pairs that may also include deeper objects.
 *
 * Often used for generic state typing
 */
export interface IObjScalarX {
  [index: string]: UScalarX
}

/**
 * List of key/value pairs where the value is always a string
 *
 * Often used for Redux Action lists for a given slice of state
 */
export interface IObjStr {
  [index: string]: string
}

/**
 * List of key/value pairs where the value is always a list of
 * strings
 *
 * Often used for storing error & warning messages relating to
 * updated values for an item
 */
export interface IObjArrStr {
  [index: string]: Array<string>|IObjArrStr
}

/**
 * List of key/value pairs where the value is always a number
 *
 * Often used for Redux Action lists for a given slice of state
 */
export interface IObjNum {
  [index: string]: number
}

/**
 * List of key/value pairs where the value is always either 1, 0 or -1
 *
 * Only used for list controls
 */
export interface IObjSortBy {
  [index: string]: ITrueFalseIgnore
}

export interface IInputField {
  id: number,
  label: string,
  value: string,
  altID: string,
  dataType: string,
  description: string,
  errorMsg: string,
  isEditable: boolean,
  attributes? : IObjScalar,
  actionSubType? : string,
  formID? : number,
  acroID? : number,
  updatedBy: number
}

export interface IEventHandler {
  btn: FEventHandler,
  link: FEventHandler,
  actions: IObjStr
}

/**
 * Used for boolean filters
 * (equivalent to: ignore | include | exclude)
 * and
 * list column sorting
 * (equivalent to: ignore | decending | ascending)
 */
export type UBoolState = 0 | 1 | -1;

export interface IListCtrlOptionItem {
  id: number,
  mode: UBoolState
}

/**
 * List control items are used for filtering and sorting lists of
 * things (payments, forms, admins, income groups, etc)
 */
export interface  IListCtrlItem {
  /**
   * Name of the field being filtered/sorted
   */
  field: string,
  /**
   * Type of data the control applies to
   *
   * * text
   * * number
   * * bool
   * * option
   */
  type: string,
  /**
   * Value on which to filter
   */
  filter: string,
  /**
   * For date & number fields this sets the lower limit of values
   */
  min: number,
  /**
   * For date & number fields this sets the upper limit of values
   */
  max: number,
  /**
   * Control how to filter boolean values
   */
  bool: UBoolState,
  /**
   * For fields that represent a fixed set of options, this allows
   * users to filter on multiple options
   */
  options: IListCtrlOptionItem[],
  /**
   * Field sort state
   *  * 1  -Descending
   *  * 0  - ignore
   *  * -1 - ascending
   */
  order: UBoolState,

  orderByValue: boolean
}


export type FTabTmpl = (tab : TabAccordion) => TemplateResult;

export interface ISingleInputOptionSimple {
  /**
   * The value of the option
   * (Also used as the label for the option if the label is empty)
   */
  value: string,
  /**
   * Human readable label for the option (what users see)
   */
  label ? : string,
  /**
   * Whether or not this option should be checked/selected by default
   */
  selected ? : boolean,
  /** Whether or not this option is available to the end user */
  hide ? : boolean,
  /**
   * Group the option belongs to
   */
  group ? : string,
  /**
   * ISO 8601 date/time string
   * Allows users to provide a date, before which, the option is
   * hidden
   */
  hideBefore ? : string,
  /**
   * ISO 8601 date/time string
   * Allows users to provide a date, after which, the option is
   * hidden
   */
  hideAfter ? : string,
  /**
   * Title attribute for `<OPTION>`
   *
   * Sometimes it's useful to have some explanitory text to give
   * users more information about an option.
   *
   * `<OPTION>` title
   * attributes are shown to the user on hover and read aloud by
   * screen readers.
   */
  title ? : string,
  /**
   * Number of this option available.
   *
   * For purchasable items, it might be useful to have a limit on
   * each option that's available
   */
  count ? : number
}

export interface ISingleInputOption extends ISingleInputOptionSimple {
  value: string,
  label: string,
  selected: boolean,
  group: string,
  hide: boolean,
  hideBefore: string
  hideAfter: string,
  title: string,
  count: number
}


/**
 * Data about the most recent event within `<option-list-editor>`
 * that resulted in a externally relevent change
 */
export interface IEventData {
  /**
   * Index of the option that triggered the event
   *
   * > __NOTE:__ This will be -1 for actions that don't apply to
   *             individual options:
   *             * ADD
   *             * SORT
   *             * APPEND_IMPORTED
   *             * IMPORT_REPLACE
   */
  index: number,
  /**
   * Action that `<option-list-editor>` wants the client to know about
   *
   * > __NOTE:__ Only actions that result in valid outcomes will
   *             trigger an event
   */
  action: string,
  /**
   * For UPDATE & TOGGLE events the field represents the option
   * property that was changed. For all other events field is empty
   */
  field: string,
  /**
   * For UPDATE events value is the new value after update
   */
  value: string
}

/**
 * List of key/value pairs that may also include deeper objects.
 *
 * Often used for generic state typing
 */
 export interface IGroupedInputOptionList {
  [index: string]: Array<ISingleInputOption>
}

export type datetime = string|null;

/**
 * Used for sorting lists
 *
 * * 1 = sort decending
 * * 0 = do not sort by this field
 * * -1 = sort by ascending
 */
export type ITrueFalseIgnore = 1|0|-1;

/**
 * Possible modifiers to be passed to sanitiseText() function to augment the
 * way the function sanitises the input
 */
export type sanTxtMods = {
  /**
   * Extra characters to add to character class extend the default
   * characters allowed in output
   *
   * @var allowed
   */
  allowed ?: string,
  /**
   * Characters for character class to replace the default
   * characters allowed in output
   *
   * @var allowed
   */
  allowOnly ?: string,
  /**
   * Regular Expression to define what is and isn't allowed in output
   *
   * @var allowedRaw
   */
  allowedRaw ?: RegExp,
  /**
   * Maximum number of characters allowed in output
   *
   * Default: 128,
   * Absolute minimum: 32 (less than 32 will be increased to 32),
   * Absolute maximum: 4096 (greater than 4096 will be reduced to 4096)
   *
   * @var max
   */
  max ?: number,
  /**
   * Whether or not to reduce multiple consecutive white space
   * characters to a single space character
   *
   * (Default: FALSE)
   *
   * @var deDupeSpace
   */
  deDupeSpace ? : boolean
}


type valDateTimeMods = {
  /**
   * Minimum value for date, datetime or time (depending on context)
   *
   * @val min
   */
  min ? : string,
  /**
   * Maximum value for date, datetime or time (depending on context)
   *
   * @val max
   */
  max ? : string,
  /**
   * Minimum time of day for datetime inputs
   *
   * @val min
   */
  minTime ?: string,
  /**
   * Maximum time of day for datetime inputs
   *
   * @val min
   */
  maxTime ?: string
}

// export interface DateTimeFormatOptions {
//     hour12 ? : boolean,
//     hour ? : string,
//     minute ? : string,
//     second ? : string,
//     weekday ? : string,
//     day: string,
//     month: string,
//     year: string,
// }

/**
 * Generic Event handler function (not for links)
 *
 * @var e Dom event from a user interaction
 */
export type FEventHandler = (e : Event) => void;

/**
 * Get a redux auto dispatching event handler
 *
 * @var _dispatch Redux store dispatch function
 *
 * @returns A function that can be used as an event handler.
 */
export type FGetEventHandlers = (dispatch : Function) => IEventHandler;

/**
 * Update a single state item from a list of items in redux state
 *
 * @var item   A single item from a Redux state array
 * @var action Redux action object
 *
 * @returns a modified version of the item.
 */
export type FUpdate = <IBaseStateItem>(item : IBaseStateItem, action: IAction) => IBaseStateItem;

/**
 * Update state list filter control item
 *
 * @var item   A single filter control item
 * @var action Redux action object
 *
 * @returns a modified version of the list control item.
 */
export type FListCtrlUpdate = (items: Array<IListCtrlItem>, action : IAction) => Array<IListCtrlItem>;

/**
 * Take a list of redux state items and filter them based on the
 * list controls provided
 *
 * @var items    List of state items to be rendered
 * @var listCtrl List of filter & sort controls for the suplied state
 *
 * @returns
 */
export type filterAndSort = (items : Array<IBaseStateItem>, listCtrl : Array<IListCtrlItem>) => Array<IBaseStateItem>;
