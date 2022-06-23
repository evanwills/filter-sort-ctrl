import { IKeyValueNum, IObjScalar, sanTxtMods } from "../types/Igeneral.d"
import { isNonEmptyStr, isNumeric } from "./validation"

/**
 * Prefix a string with an underscore and make it lowercase
 *
 * @param {string} whole Whole matched string
 *
 * @returns {string} converted string
 */
const separatorInner = (sep : string ) => (whole : string) : string => {
  return sep + whole.toLowerCase()
}

/**
 * Convert a camel case string a character sperated string
 *
 * @param {string} input String to be converted
 * @param {bool}   upper Make output uppercase (like PHP constant)
 * @param {string} sep   Character to use as snake/kebab case
 *                       separator
 *
 * @returns {string} Separated string
 */
export const camelToSeparatedStr = (
  input : string,
  upper : boolean = false,
  sep : string = '_'
) : string => {
  const output = input.replace(/[A-Z0-9][a-z0-9]+/g, separatorInner(sep))

  return (input !== output && upper === true)
    ? output.toUpperCase()
    : output
}

/**
 * Convert a camel case string to snake case
 *
 * @param {string} input String to be converted
 * @param {bool}   upper Make output uppercase (like PHP constant)
 *
 * @returns {string}
 */
export const camelToSnake = (input : string, upper : boolean = false) : string => {
  return camelToSeparatedStr(input, upper, '_')
}

/**
 * Convert a camel case string to kebab case
 *
 * @param {string} input String to be converted
 * @param {bool}   upper Make output uppercase (like PHP constant)
 *
 * @returns {string}
 */
export const camelToKebab = (input : string, upper : boolean = false) : string => {
  return camelToSeparatedStr(input, upper, '-')
}

export const snakeToText = (input : string) : string => {
  return input.replace(/[_-]/ig, ' ')
}

/**
 * Convert snake case string to camel case
 *
 * NOTE: input can be hyphen case or camel case
 *
 * @param {string} input    String to be converted
 * @param {number} start    Index of the first part to be included
 *                          in the output
 * @returns {string}
 */
export const snakeToCamel = (input : string, start : number = 0) : string => {
  const _tmp = input.match(/[ _-]/s);
  const splitter = (_tmp !== null)
    ? _tmp[0]
    : '';

  if (splitter !== '') {
    const tmp = input.split(splitter)
    let output = tmp[start].toLowerCase()

    for (let a = start + 1; a < tmp.length; a += 1) {
      output += ucFirst(tmp[a], true);
    }

    return output
  } else {
    return input;
  }
}

export const textToSnake = (input : string, sep : string = '_') : string => {
  return input.replace(/\s+/g, sep)
}

/**
 * Make the first letter in a string uppercase
 *
 * @param {string}  input    String to be modified
 * @param {boolean} noChange If TRUE, do not force the rest of the
 *                           string to lower case
 *
 * @returns {string} modified string
 */
export const ucFirst = (input : string, noChange : boolean = false) : string => {
  const head = input.substring(0, 1).toLocaleUpperCase();
  let tail = input.substring(1);

  if (noChange !== true) {
    tail = tail.toLocaleLowerCase();
  }
  // console.group('ucFirst()')
  // console.log('input:', input);
  // console.log('head:', head);
  // console.log('input.substring(1):', input.substring(1));
  // console.log('tail:', tail);
  // console.log('head + tail:', head + tail)
  // console.groupEnd();

  return head + tail;
}

/**
 * Make a word singular by stripping the trailing "S".
 *
 * @param input Any string that ends with a plural word
 *              (i.e. trailing "S")
 *
 * @returns string without trailing "S"
 */
export const makeSingular = (input : string) : string => {
  return input.replace(/(?<=[a-z])s(?=\s*$)/i, '');
}

/**
 * Return an "s" if the input is not equal to 1.
 * (Used for making words pural)
 *
 * @param {number} num
 * @returns {string}
 */
export const s = (num : number|string) : string => {
  return (isNumeric(num) && num === 1)
    ? ''
    : 's'
}

/**
 * Number of seconds to be converted into a human radable string
 * representing a duartion period
 *
 * @param {number} seconds Duration period
 *
 * @returns {string} Human readable representation of duration period
 */
export const humanSeconds = (seconds : number) : string => {
  let output : string = ''
  let tmp : number = 0
  let _secs : number = seconds
  let _sep : string = ''
  const units : Array<IKeyValueNum> = [
    { key: 'year', value: 31557600 }, // 365.25 days
    { key: 'month', value: 2629800 }, // 36.25 days / 12 months
    { key: 'day', value: 86400 }, // 24 hours
    { key: 'hour', value: 3600 }, // 60^2
    { key: 'minute', value: 60 }
  ]

  for (let a = 0; a < units.length; a += 1) {
    const value : number = units[a].value
    const unit : string = units[a].key
    if (_secs >= value) {
      tmp = Math.floor(_secs / value)
      _secs = (_secs - (tmp * value))
      output += _sep + tmp + ' ' + unit + s(tmp)
      _sep = ', '
    }
  }
  if (_secs > 0) {
    output += _sep + _secs + ' second' + s(_secs)
  }

  return output
}

/**
 * makeAttributeSafe() makes a string safe to be used as an ID or
 * class name
 *
 * @param {string} _attr A string to be made safe to use as a HTML
 *             class name or ID
 *
 * @returns {string} class name or ID safe string
 */
export const makeAttributeSafe = (_attr : string, prefixNum : boolean = false) : string => {
  let _output = ''

  if (typeof _attr !== 'string') {
    throw new Error('makeAttributeSafe() expects only parameter "_attr" to be a non-empty string. ' + typeof _attr + ' given.')
  }

  _output = _attr.replace(/[^a-z0-9_-]+/ig, '-')
  _output = _output.replace(/(_|-)+/g, '$1');
  _output = _output.replace(/(?:(_)-_?|(-)_-?)+/i, '$1$2');
  _output = _output.replace(/^[-_]|[-_]$/g, '');

  if (_output === '') {
    throw new Error('makeAttributeSafe() expects only parameter "_attr" to be string that can be used as an HTML class name or ID. "' + _attr + '" cannot be used. After cleaning, it became an empty string.')
  }

  if (prefixNum && !_output.match(/^[a-z_]/i)) {
    _output = '_' + _output
  }

  return _output
}


/**
 * Make a string safe to be used as an ID
 *
 * @param {string} input Value to be used as an ID
 *
 * @returns {string} value that is safe to be used as an ID
 */
 export const idSafe = (input : string) : string => {
  return makeAttributeSafe(input, true);
}


/**
 * Get string to use as class name for HTML element
 *
 * @param {object} props       properties for the element
 * @param {string} BEMelement  BEM *element* class name suffix
 * @param {string} BEMmodifier BEM *modifier* class name suffix
 * @param {string} prefix      Prefix for object property name to
 *                             allow for the component to have
 *                             multiple elements with different
 *                             values for the same attribute name
 *
 * @returns {string} HTML element class name
 */
 export const getClassName = (props : IObjScalar, BEMelement : string, BEMmodifier : string = '', prefix : string = '') : string => {
  const _cls = (isNonEmptyStr(prefix))
    ? prefix.trim() + 'Class'
    : 'class'
  const _suffix = (isNonEmptyStr(BEMelement))
    ? '__' + BEMelement.trim()
    : ''
  const _modifier = (isNonEmptyStr(BEMmodifier))
    ? '--' + BEMmodifier.trim()
    : ''
  let _output = '';

  if (typeof props[_cls] === 'string') {
    _output = props[_cls] as string;
  }

  _output = _output.trim();
  _output += (_output !== '') ? _suffix : ''
  _output += (_output !== '' && _modifier !== '') ? ' ' + _output + _modifier : ''

  return _output
}

export const isTrue = (input : any) : boolean => {
  // console.group('isTrue()');
  // console.log('input:', input)
  // console.log('typeof input:', typeof input)
  // console.log('parseInt(input):', parseInt(input))
  // console.log('isBool(input):', isBool(input))
  switch (typeof input) {
    case 'boolean':
      // console.groupEnd();
      return input;

    case 'number':
      // console.groupEnd();
      return (input >= 1);

    case 'string':
      if (isNumeric(input)) {
        // console.groupEnd();
        return (parseFloat(input) >= 1);
      } else {
        const _tmp = input.toLowerCase();
        // console.groupEnd();
        return (_tmp === 'true' || _tmp === 'yes' || _tmp === 'on');
      }

    default:
      // console.groupEnd();
      return false;
  }

}


export const bool2num = (input: any) : string => {
  // console.group('bool2num()');
  // console.log('input:', input)
  // console.log('input > 0:', input > 0)
  // console.log('parseInt(input):', parseInt(input))
  // console.log('isBool(input):', isBool(input))
  // console.groupEnd();
  return (isTrue(input))
    ? '1'
    : '0';
}

/**
 * Make sure the limit is within range.
 *
 * @param mixed   $input   Value to use a limit
 * @param integer $default Default value to use if unable to get
 *                         new value
 * @param integer $min     Minimum value allowed
 * @param integer $max     Maximum value allowed
 *
 * @return integer
 */
export const _charLimit = (input : string|number, _default : number, _min : number, _max : number) : number => {
    if (isNumeric(input) !== false) {
      const _num : number = (typeof input === 'string')
        ? parseInt(input)
        : input;

      if (_num < _min) {
        return _min;
      } else {
        return (_num < _max)
          ? _num
          : _max;
      }
    } else {
      return _default;
    }
}

/**
 * Make sure a person's name only has valid characters
 *
 * Characters allowed are:
 * * alphabetical
 * * spaces
 * * hypens
 * * full stops
 * * apostrophies
 *
 * NOTE: Numbers are forbidden
 *
 * @param name     Name of person to be sanitised
 * @param maxChars Maximum number of characters allowed
 *                 (default: 64, min: 1, max: 64)
 *
 * @return string
 */
export const sanitiseName = (name : string, maxChars : number = 64) => {
    const _maxChars = _charLimit(maxChars, 64, 1, 64);

    let output = name.replace(/[^\w \-.\']+/ig, ' ' );

    output = output.replace(/\d+(?:\.\d+)*/g, ' ');

    output = output.replace(/([ \-.\'])+/g, '$1');
    // trim is done second because we may end up with white space at
    // the beginin or end if there are invalid characters at the
    // begining or end of the string. We trim a final time because we
    // may also end up with white space characters after we truncate
    // the string
    output = output.trim().substring(0, _maxChars).trim();

    return output;
}

/**
 * Makes sure a text has no invalid characters.
 *
 * Characters allowed are: alpha numeric, spaces and basic punctuation.
 * Forbidden characters: ` ~ @ # $ % ^ * _ + = { } | \ ; " < >
 *                       plus most other special characters
 *
 * @param input     Title to be sanitised
 * @param modifiers Object containing up to six properties
 *                   * `max` Maximum number of characters
 *                        (default: 128, min: 32, max: 4096)
 *                   * `allowed` {string[]} List of extra characters
 *                               that are also allowed in sanitised
 *                               output
 *                   * `allowonly` {string[]} List of characters that
 *                               replace the default allowed
 *                               characters. Only these characters
 *                               will be returned in sanitised output
 *                   * `allowedRaw` Regular Expression to find
 *                               characters that should be removed
 *                               from output
 *                   * `deDupeSpace` Whether or not to reduce
 *                               multiple consecutive white space
 *                               characters to a single space
 *                               character
 *
 * @return string Clean, safe text string
 */
export const sanitiseText = (input: string, modifiers : sanTxtMods = {}) : string => {
  const maxLen = (typeof modifiers.max === 'number')
    ? _charLimit(modifiers.max, 128, 32, 4096)
    : 128;
  let allowedChars : RegExp;
  const dedupe = (typeof modifiers.deDupeSpace === 'boolean' && modifiers.deDupeSpace === true);

  if (modifiers.allowedRaw instanceof RegExp) {
    allowedChars = modifiers.allowedRaw;
  } else if (Array.isArray(modifiers.allowed) && modifiers.allowed.length > 0) {
    allowedChars = new RegExp(
      '[^\w&, \-.?:!\'()\/' + _sanitiseCharClass(modifiers.allowed) + ']+',
      'ig'
    );
  } else if (Array.isArray(modifiers.allowOnly) && modifiers.allowOnly.length > 0) {
    allowedChars = new RegExp(
      '[^' + _sanitiseCharClass(modifiers.allowOnly) + ']+',
      'ig'
    );
  } else {
    allowedChars = /[^\w&, \-.?:!\'()\/]+/g;
  }

  let output = input.replace(allowedChars, ' ');

  if (dedupe === true) {
    // reduce white space
    output = output.replace(/\s+/, ' ')
  }

  // trim is done second because we may end up with white space at
  // the beginin or end if there are invalid characters at the
  // begining or end of the string. We trim a final time because we
  // may also end up with white space characters after we truncate
  // the string
  return output.trim().substring(maxLen).trim();
};



/**
 * Sanitise characters that are to be used in a regex character class
 *
 * @param input Characters to be used in a character class
 *
 * @return sanitised characters for character class
 */
const _sanitiseCharClass = (input : string) : string => {
  if (input === '') {
      return '';
  }
  let _input = input;

  const output = [];
  const _escapes = [
      'd', 'D', 'h','H', 's', 'S', 'v', 'V',
      'w', 'W', 'b', 'B', 't', 'r', 'n'
  ];
  const _special = [']', '^', '-', '\\', '/'];

  const regex = /([a-z]-[a-z]|[0-9]-[0-9])/ig;
  const matches = _input.match(regex);

  if (matches !== null) {
    for (let a = 0; a < matches.length; a += 1) {
      output.push(matches[a][1]);
      _input = _input.replace(matches[a][1], '');
    }
  }

  const _tmp = _input.split('');

  for (let a = 0; a < _tmp.length; a += 1) {
    const b = a + 1;

    if (_tmp[a] === '\\' &&
        typeof _tmp[b] === 'string' &&
        _escapes.indexOf(_tmp[b]) > -1
    ) {
        output.push('\\' + _tmp[b]);
        a += 1;
    } else {
      const _tmp_ = (_special.indexOf(_tmp[a]) > -1)
        ? '\\' + _tmp[a]
        : _tmp[a];
      output.push(_tmp_);
    }
  }

  return output.join('');
}

/**
 * Get ISO 8601 date/time string to use in date & date/time inputs
 *
 * @param time     Unix timestamp (including milliseconds)
 * @param dateOnly Only return date part of ISO 8601 date/time string
 *
 * @returns ISO 8601 date/time or date only string
 */
export const timeToIsoStr = (time: number, dateOnly : boolean = false) : string => {
  const output = new Date(time).toISOString();
  return (dateOnly === true)
    ? output.replace(/T.*$/i, '')
    : output.replace(/\.[0-9]+[a-z]$/i, '');
}

/**
 * Convert ISO 8601 Date/time string to a unix timestamp
 * (seconds since Unix epoc)
 *
 * @param dateTime Date time string returned from a date or
 *                 datetime-local type input field
 *
 * @returns Number of seconds since unix epoc
 */
export const isoStrToTime = (dateTime: string) : number => {
  return (dateTime === '')
    ? 0
    : Math.round(new Date(dateTime).getTime() / 1000);
}

/**
 * Get a number from input. If input cannot be converted to a number,
 * return default number
 *
 * @param input      Value to be made a number
 * @param _default   Default value if input cannot be converted to a number
 * @param forceFloat Make the output a float
 *
 * @returns A number either input forced to number or default if it
 *          wasn't possible to convert input
 */
export const getNum = (input: any, _default : number = 0, forceFloat : boolean = false) : number => {
  if (!isNumeric(input)) {
    return _default;
  }

  if (typeof input === 'string') {
    return (forceFloat !== true)
      ? parseInt(input)
      : parseFloat(input);
  } else {
    return (forceFloat !== true)
      ? Math.round(input)
      : input;
  }
}
