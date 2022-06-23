import { ISingleInputOptionSimple, ISingleInputOption, UScalar, UBoolState } from "../types/Igeneral";
import { isNumber, isStr } from "./validation";

/**
 * Round a number to a given number of decimal places
 *
 * If places is negative, input will be rounded to
 * tens/hundreds/thousands etc.
 *
 * @param num    Number to be rounded
 * @param places Number of decimal places to round to
 *
 * @returns Rounded number
 */
export const round = (input : number, places : number = 0) : number => {
  if (places === 0) {
    return Math.round(input);
  }
  const rev = (places < 0)

  let a = (rev)
    ? places * -1
    : places

  // Limit the decimal places to 5
  a = (a >= 5)
    ? 5
    : a;

  const _places = Math.pow(10, a);

  return (rev)
    ? Math.round(input / _places) * _places
    : Math.round(input * _places) / _places;
}

/**
 * Implode an array of scalar items to a string list of things.
 *
 * @param sep   Item separator string
 * @param input List of things to be concatinated
 * @returns
 */
export const implode = (sep = '', input: Array<UScalar>) : string => {
  let _output = '';
  let _sep = '';

  for (let a = 0; a < input.length; a += 1) {
    _output += _sep + input[a] as string;
    _sep = sep;
  }

  return _output;
}

/**
 * Get a string to be used as an HTML attribute value if the input is
 * not a string or a number
 *
 * @param {any} input Value to be returned (hopefully) String or
 *                    number
 * @param {string, undefined} defaultStr default string if input is
 *                   not valid
 *
 * @returns {string} String to be used as an HTML attribute value
 */
export const propOrUn = (input : any, defaultStr : string = '') : string|undefined  => {
  // console.group('propOrUn()');
  // console.log('input:', input);
  // console.log('defaultStr:', defaultStr);
  // console.log('isNumber(input):', isNumber(input));
  // console.log('isStr(input):', isStr(input));
  // console.groupEnd();
  if (isNumber(input) || isStr(input) || input === true) {
    return input.toString();
  } else if (defaultStr !== '') {
    return defaultStr;
  } else {
    return undefined;
  }
}

/**
 * Get a string to be used as an HTML attribute value if the input is
 * not a non-empty string or a number greater than zero
 *
 * @param {any} input Value to be returned (hopefully) String or
 *                    number
 * @param {string, undefined} defaultStr default string if input is
 *                   not valid
 *
 * @returns {string} String to be used as an HTML attribute value
 */
export const propOrUnNE = (input : any, defaultStr : string = '') : string|undefined  => {
  const output = propOrUn(input, defaultStr);

  if (typeof output === 'undefined' || output === '' ||
    (isNumber(input) && input <= 0)
  ) {
    return (defaultStr !== '')
      ? defaultStr
      : undefined;
  } else {
    return output;
  }
}

/**
 * Get a unique ID for an option list item
 *
 * @param option Input option object
 *
 * @returns string that should be unique for all the options in that list
 */
export const getOptionID = (option: ISingleInputOptionSimple) : string => {
  const _type = typeof option.value;
  if ((_type === 'string' && option.value !== '') || _type === 'number') {
    return option.value.toString();
  } else if (typeof option.label === 'string' && option.label !== '') {
    return option.label.toString();
  } else {
    return ''
  }
}

export const sortOptionList = (options : Array<ISingleInputOption>) : Array<ISingleInputOption> => {
  // const sorter = (a : ISingleInputOption, b : ISingleInputOption) : number => {
  //   if (a.group > b.group) {
  //     return 1;
  //   } else if (a.group < b.group) {
  //     return -1
  //   } else {
  //     if (a.label > b.label) {
  //       return 1;
  //     } else if (a.label < b.label) {
  //       return -1;
  //     } else {
  //       return 0;
  //     }
  //   }
  // }
  // const _options = [...options];

  // _options.sort(sorter);

  return options;
}


/**
 * Get the new saveState of an item
 *
 * @param saveState Current saveState of an item
 *
 * @returns new saveState of the item
 */
export const setUnsaved = (saveState: number) : number => {
  return (saveState > 0)
    ? 2
    : 0;
}

/**
 * Move an item in a list up or down by one relative to its starting
 * position
 *
 * @param items     List of items
 * @param index     Index of item to be moved
 * @param direction Direction to move item
 *
 * @returns Update list of items where item matched by index was
 *          moved either up or down as dictated by `direction`
 */
export const moveInList = <item>(items : Array<item>, index: number, direction: string) : Array<item> => {
  const toMove = items.filter((_item : item, i : number) => (index === i));
  const otherItems = items.filter((_item : item, i : number) => (index !== i));
  const newIndex = (direction.trim().toLowerCase() === 'up')
    ? index - 1
    : index + 1;

  return [
    ...otherItems.slice(0, newIndex),
    toMove[0],
    ...otherItems.slice(newIndex)
  ];
}

export const getDate = (input : any) : Date|false => {
  if (input instanceof Date) {
    return input;
  }
  const tO = typeof input;
  if (tO === 'string' || tO === 'number') {
    return new Date(input);
  } else {
    return false;
  }
}


export const getBoolState = (input : string|number) : UBoolState => {
  const output = (typeof input === 'string')
    ? parseInt(input)
    : input;

  if (output < 0) {
    return -1;
  } else if (output > 0) {
    return 1;
  } else {
    return 0;
  }
}
