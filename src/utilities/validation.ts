/**
 * This file contains two collections of validation functions:
 *   1. Simple type validation functions
 *   2. Object property type checkers
 *
 * The simple validation functions only test type of a single value.
 * It returns `TRUE` if the value passed validation or `FALSE`
 * otherwise.
 *
 * The complex validation functions (`invalid_[type]_()`) test
 * whether a property exists in an object then whether the property
 * is of the correct type. They return `FALSE` if the object's
 * property was _NOT_ invalid. If the value was invalid, it returns
 * a string naming the value's data type.
 * This makes super simple and efficient to test objects and report
 * on invalid property values.
 *
 * These functions were originally created for simpler
 * error reporting and thus return `FALSE` if the value is of the
 * correct type. If the type was incorrect, the data type is
 * returned so it can be used in an error message.
 */

 import { IObjScalarX, valDateTimeMods } from "../types/Igeneral"

 /**
  * Check whether something is a string
  *
  * @param {any} input Value that should be a string
  *
  * @returns {boolean} `TRUE` if the input is a string.
  *                    `FALSE` otherwise
  */
 export const isStr = (input : any) : boolean => (typeof input === 'string')

 /**
  * Test whether a value is a string and not empty (after being trimmed)
  *
  * e.g.
  *  * isNonEmptyStr('A') = TRUE
  *  * isNonEmptyStr('\nA, B, C\t') = TRUE
  *  * isNonEmptyStr('123456') = TRUE
  *  * isNonEmptyStr('0') = TRUE
  *  * isNonEmptyStr(12345) = FALSE
  *  * isNonEmptyStr(0) = FALSE
  *  * isNonEmptyStr(' ') = FALSE
  *  * isNonEmptyStr('\n\t') = FALSE
  *
  * @param {any} input Value that should be a non-empty string
  *
  * @returns {boolean} `TRUE` if the input is a non-empty string.
  *                    `FALSE` otherwise
  */
 export const isNonEmptyStr = (input : any) : boolean => (isStr(input) && input.trim() !== '')

 /**
  * Check whether something is a boolean
  *
  * @param {any} input value that shoudl be a boolean
  *
  * @returns {boolean} `TRUE` if the input is a boolean.
  *                    `FALSE` otherwise
  */
 export const isBool = (input : any) : boolean => (typeof input === 'boolean')

 /**
  * Test whether a value is boolean and TRUE
  *
  * e.g.
  *  * isBoolTrue(true) = TRUE
  *  * isBoolTrue(false) = FALSE
  *  * isBoolTrue() = FALSE
  *  * isBoolTrue(0) = FALSE
  *  * isBoolTrue(1) = FALSE
  *  * isBoolTrue('true') = FALSE
  *
  * @param {any} input value that should be boolean and _TRUE_
  *
  * @returns {boolean} `TRUE` if the input is a boolean and `TRUE`.
  *                    `FALSE` otherwise
  */
 export const isBoolTrue = (input : any) : boolean => (typeof input === 'boolean' && input === true)

 /**
  * Test whether a value is boolean and FALSE
  *
  * e.g.
  *  * isBoolTrue(false) = TRUE
  *  * isBoolTrue(true) = FALSE
  *  * isBoolTrue() = FALSE
  *  * isBoolTrue(0) = FALSE
  *  * isBoolTrue(1) = FALSE
  *  * isBoolTrue('true') = FALSE
  *
  * @param {any} input value that shoudl be a boolean
  *
  * @returns {boolean} `TRUE` if the input is a boolean and `FALSE`.
  *                    `FALSE` otherwise
  */
 export const isBoolFalse = (input : any) : boolean => (typeof input === 'boolean' && input === false)

 /**
  * Check whether something is a number
  *
  * @param {any} input Value that should be a number
  *
  * @returns {boolean} `TRUE` if the input is a number.
  *                    `FALSE` otherwise
  */
 export const isNumber = (input : any) : boolean => {
   return (typeof input === 'number' ||
           (typeof input === 'string' &&
            input.match(/^-?[0-9]+(?:\.[0-9]+)?$/) !== null &&
            !isNaN(parseFloat(input))
           )
          );
   // return (typeof input === 'number' && !isNaN(parseFloat(input)) && !isFinite(input))
 }

 /**
  * Check whether something is a number or can be converted to a
  * number
  *
  * > NOTE: This is much more permissive than is isNumber() because
  * >       strings that contain numbers will have anything
  * >       non-numeric stripped out
  * >       (e.g. "abc123" will pass this test and return TRUE)
  *
  * @param {any} input Value that should be numeric
  *
  * @returns {boolean} `TRUE` if the input is a Function.
  *                    `FALSE` otherwise
  */
 export const isNumeric = (input : any) : boolean => {
   if (isNumber(input)) {
     return true
   } else if (isStr(input)) {
     return isNumber(input * 1)
   } else {
     return false
   }
 }

 /**
  * Check whether something is either a string or number
  *
  * @param {any} input Value that should be numeric
  *
  * @returns {boolean} `TRUE` if the input is either a string or number
  *                    `FALSE` otherwise
  */
 export const isStrNum = (input : any) : boolean => (isNumeric(input) || isStr(input))

 /**
  * Check whether something is an integer
  *
  * @param {any} input Value that should be numeric
  *
  * @returns {boolean} `TRUE` if the input is an integer
  *                    `FALSE` otherwise
  */
 export const isInt = (input : any) : boolean => (isNumber(input) && !isNaN(parseInt(input)))

 /**
  * Check whether something is an integer
  *
  * @param {any} input Value that should be numeric
  *
  * @returns {boolean} `TRUE` if the input is an integer greater than
  *                    zero. `FALSE` Otherwise
  */
 export const isPosInt = (input : any) : boolean => (isInt(input) && input > 0)

 /**
  * Check whether something is a string, boolean or number
  *
  * The definition "Scalar" this function uses is based on the PHP
  * function of the same name (`is_scalar()`).
  * This definitition may conflict with some definitions of scalar
  * where strings, and/or booleans are excluded or where `null` _is_
  * included.
  * (see: https://www.php.net/manual/en/function.is-scalar.php)
  *
  * @param {any} input Value that should be a scalar
  *
  * @returns {boolean} `TRUE` if the input is a scalar value.
  *                    `FALSE` otherwise
  */
 export const isScalar = (input : any) : boolean => {
   const _type = typeof input
   return (_type === 'string' || _type === 'boolean' || _type === 'number')
 }

 /**
  * Check whether something is a Function
  *
  * @param {any} functionToCheck function
  *
  * @returns {boolean} `TRUE` if the input is a Function.
  *                    `FALSE` otherwise
  */
 export const isFunction = (functionToCheck : any) : boolean => {
   return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]'
 }

 /**
  * Check whether a value is a normal JS data object
  *
  * @param {any} input value to be tested
  *
  * @returns {boolean} `TRUE` if input is an object, `FALSE` otherwise
  */
 export const isObject = (input : any) : boolean => {
   return (typeof input === 'object' &&
           !Array.isArray(input) &&
           input !== null)
 }

 /**
  * Test whether a variable is iterable
  *
  * @param {any} value to be tested
  *
  * @return {boolean} `TRUE` if input is an array or iterable object
  *                   `FALSE` otherwise
  */
 export const isIterable = (input : any) : boolean => {
   // checks for null and undefined
   if (input == null) {
     return false
   }
   return (typeof input[Symbol.iterator] === 'function' || typeof input.propertyIsEnumerable === 'function')
 }

 // ========================================================

 /**
  * Test whether an object contains a given property and the value
  * of that property is a string
  *
  * @param {string} prop  name of the property to be tested
  * @param {object} input object that might contain the property of
  *                       the correct type
  * @param {boolean} notEmpty
  *
  * @returns {false,string} If the value is a string then it is NOT
  *                         invalid. Otherwise the value's data type
  *                         returned (so it can be used when
  *                         reporting erros).
  */
 export const invalidString = (prop : string, input : IObjScalarX, notEmpty : boolean) : string | false => {
   let tmp = ''

   if (!isStr(prop)) {
     throw new Error('invalidString() expects first parameter "prop" to be a string matching the name of a property in the object. ' + typeof prop + ' given.')
   }
   if (typeof input !== 'object') {
     throw new Error('invalidString() expects second parameter "input" to be a an object containing "' + prop + '" property. ' + typeof input + ' given.')
   }

   tmp = typeof input[prop]
   const _notEmpty = isBool(notEmpty) ? notEmpty : true
   if (typeof input[prop] === 'string') {
     const _tmp : string = input[prop] as string;
     if (_tmp.trim() === '' && _notEmpty === true) {
       return 'empty string';
     } else {
       return false;
     }
   } else {
     return tmp;
   }
 }

 /**
  * Test whether an object contains a given property and the value
  * of that property is either a string or a number
  *
  * @param {string} prop  name of the property to be tested
  * @param {object} input object that might contain the property of
  *                       the correct type
  *
  * @returns {false,string} If the value is a string or number then
  *                         it is NOT invalid. Otherwise the value's
  *                         data type returned (so it can be used when
  *                         reporting errors).
  */
 export const invalidStrNum = (prop : string, input : IObjScalarX) : string | false => {
   let tmp = ''

   if (typeof prop !== 'string') {
     throw new Error('invalidStrNum() expects first parameter "prop" to be a string matching the name of a property in the object. ' + typeof prop + ' given.')
   }
   if (typeof input !== 'object') {
     throw new Error('invalidStrNum() expects second parameter "input" to be a an object containing "' + prop + '" property. ' + typeof input + ' given.')
   }

   tmp = typeof input[prop]
   if (tmp !== 'string' && tmp !== 'number') {
     return tmp
   } else {
     return false
   }
 }

 /**
  * Test whether an object contains a given property and the value
  * of that property is a number
  *
  * @param {string} prop  name of the property to be tested
  * @param {object} input object that might contain the property of
  *                       the correct type
  *
  * @returns {false,string} If the value is a number then it is NOT
  *                         invalid. Otherwise the value's data type
  *                         returned (so it can be used when
  *                         reporting errors).
  */
 export const invalidNum = (prop : string, input : IObjScalarX) : string | false => {
   let tmp = ''

   if (typeof prop !== 'string') {
     throw new Error('invalidNum() expects first parameter "prop" to be a string matching the name of a property in the object. ' + typeof prop + ' given.')
   }
   if (typeof input !== 'object') {
     throw new Error('invalidNum() expects second parameter "input" to be a an object containing "' + prop + '" property. ' + typeof input + ' given.')
   }

   tmp = typeof input[prop]
   if (tmp === 'undefined') {
     return tmp
   } else if (!isNumber(input[prop])) {
     return tmp + ' (is not a number)'
   } else {
     return false
   }
 }

 /**
  * Test whether an object contains a given property and the value
  * of that property is an array
  *
  * @param {string}  prop     name of the property to be tested
  * @param {object}  input    object that might contain the property
  *                           of the correct type
  * @param {boolean} notEmpty whether or not the array must be
  *                           not-empty If TRUE and the array is empty
  *                           'empty array' will be returned instead
  *                           of false
  *
  * @returns {false,string} If the value is an array then it is NOT
  *                         invalid. Otherwise the value's data type
  *                         returned (so it can be used when
  *                         reporting errors).
  */
 export const invalidArray = (prop : string , input : IObjScalarX, notEmpty : boolean) : string | false => {
   const _notEmpty = (isBool(notEmpty) && notEmpty === true)
   if (typeof prop !== 'string') {
     throw new Error('invalidArray() expects first parameter "prop" to be a string matching the name of a property in the object. ' + typeof prop + ' given.')
   }
   if (typeof input !== 'object') {
     throw new Error('invalidArray() expects second parameter "input" to be a an object containing "' + prop + '" property. ' + typeof input + ' given.')
   }

   if (Array.isArray(input[prop])) {
     const _tmp : Array<IObjScalarX> = input[prop] as Array<IObjScalarX>;
     if (_notEmpty && _tmp.length === 0) {
       return 'empty array'
     } else {
       return false
     }
   } else {
     return typeof input[prop] + ' (not Array)'
   }
 }

 /**
  * Test whether an object contains a given property and the value
  * of that property is a boolean
  *
  * @param {string}  prop      name of the property to be tested
  * @param {object}  input     object that might contain the property
  *                            of the correct type
  * @param {boolean} trueFalse (optional) If `TRUE`, object property
  *                            must be _BOTH_ `boolean` _AND_ `TRUE`.
  *                            If `FALSE`, it must be _BOTH_ `boolean`
  *                            _AND_ `FALSE`
  *
  * @returns {false,string} If the value is a boolean then it is NOT
  *                         invalid. Otherwise the value's data type
  *                         returned (so it can be used when
  *                         reporting errors).
  */
 export const invalidBool = (prop : string , input : IObjScalarX, trueFalse : boolean) : string | false => {
   if (typeof prop !== 'string') {
     throw new Error('invalidArray() expects first parameter "prop" to be a string matching the name of a property in the object. ' + typeof prop + ' given.')
   }
   if (typeof input !== 'object') {
     throw new Error('invalidArray() expects second parameter "input" to be a an object containing "' + prop + '" property. ' + typeof input + ' given.')
   }
   const _trueFalse = (isBool(trueFalse)) ? trueFalse : null

   const _type = typeof input[prop]
   if (_type === 'boolean') {
     if (_trueFalse === null || input[prop] === trueFalse) {
       return false
     } else {
       const tfStr : string = (trueFalse) ? 'TRUE' : 'FALSE'
       return 'Not ' + tfStr
     }
   } else {
     return _type
   }
 }

 /**
  * Test whether an object contains a given property and the value
  * of that property is a scalar value (string, number or boolean)
  *
  * @param {string} prop  name of the property to be tested
  * @param {object} input object that might contain the property of
  *                       the correct type
  *
  * @returns {false,string} If the value is a scalar then it is NOT
  *                         invalid. Otherwise the value's data type
  *                         returned (so it can be used when
  *                         reporting errors).
  */
 export const invalidScalar = (prop : string, input : IObjScalarX) : string | false => {
   if (typeof prop !== 'string') {
     throw new Error(
       'invalidScalar() expects first parameter "prop" to be a ' +
       'string matching the name of a property in the object. ' +
       typeof prop + ' given.'
     );
   }
   if (typeof input !== 'object') {
     throw new Error(
       'invalidScalar() expects second parameter "input" to be a ' +
       'an object containing "' + prop + '" property. ' +
       typeof input + ' given.')
   }

   const _type : string = typeof input[prop]
   return (_type !== 'boolean' && _type !== 'string' && _type !== 'number')
     ? _type
     : false
 }

 /**
  * Validates value of an `<input type="date" />` field to make sure
  * it conforms to an ISO 8601 date formatted string and is between
  * min & max if supplied
  *
  * @param input     Value supplied by user
  * @param _default  Default value to be returned
  * @param _modifier Object containing a min and/or max value both of
  *                  which can be either a unix timestamp or an
  *                  ISO 8601 date/time string (or any string parsable by strtotime())
  *
  * @return string|false
  */
 export const validateIsoDate = (
   input : string, _default : string|false = false, _modifiers : valDateTimeMods = {}
 ) : string|false => {
   const _tmp = validateIsoDateTime(input, _default, _modifiers);
   return (_tmp !== false && _tmp !== _default)
     ? (_tmp as string).replace(/T.*$/, '')
     : _tmp;
 }

 /**
 * Validates an ISO 8601 date time formatted string and is between
 * min & max if supplied
 *
 * @param input     Value supplied by user
 * @param _default  Default value to be returned
 * @param _modifier An object containing a min and/or max value both
 *                  of which can be either a unix timestamp or an
 *                  ISO 8601 date/time string
 *
 * @return string|false
 */
 export const validateIsoDateTime = (
   input : string , _default : string|false = false, _modifiers : valDateTimeMods = {}
 ) : string|false => {
   const _tmp = new Date(input);

   if (_tmp.toString() === 'Invalid Date') {
     return _default;
   }
   const _timeStamp = _tmp.getTime()
   console.group('validateIsoDateTime()')
   console.group('input:', input)
   console.group('_tmp:', _tmp)
   console.group('_timeStamp:', _timeStamp)

   if (typeof _modifiers.min === 'string' && _modifiers.min === '') {
     const _min = new Date(_modifiers.min);
     if (_min.toString() === 'Invalid Date') {
       let _minTime = 0;
       try {
         _minTime = strToTime(_modifiers.min);
       } catch (error) {
         throw new Error(
           'Minimum date supplied to validateIsoDateTime() is invalid'
         );
       }

       if (_minTime > _timeStamp) {
         return _default;
       }
     } else if (_min.getTime() > _timeStamp) {
       return _default
     }
   }

   if (typeof _modifiers.max === 'string' && _modifiers.max === '') {
     const _max = new Date(_modifiers.max);
     if (_max.toString() === 'Invalid Date') {
       let _maxTime = 0;
       try {
         _maxTime = strToTime(_modifiers.max);
       } catch (error) {
         throw new Error(
           'Maximum date supplied to validateIsoDateTime() is invalid'
         );
       }

       if (_maxTime < _timeStamp) {
         return _default;
       }
     } else if (_max.getTime() < _timeStamp) {
       return _default
     }
   }
   return _tmp.toISOString();
 }

 /**
  * Converts the returned value of an `<input type="time" />` field
  * into the an integer between 1 & 24 so it can be stored in the
  * db
  *
  * @param time       ISO8601 Time string supplied by user
  *                                (must include seconds)
  * @param _default   Default value to be returned
  * @param _modifiers Array containing a min & max value both of
  *                   which can be either a hour of day, the number
  *                   of seconds after midnight or an ISO 8601 time
  *                   string (with or without seconds)
  *
  * @return string|false
  */
 export const validateIsoTime = (
   time : string, _default : string|false = false, _modifiers : valDateTimeMods = {}
 ) : string|false => {

   let _time = 0;
   if (isNumeric(time)) {
     _time = parseInt(time);
   } else {
     try {
       _time = _getTimeAsInt(time);
     } catch (erorr) {
       return _default;
     }
   }

   if (typeof _modifiers.min === 'string' && _modifiers.min !== '') {
     let _min = 0;
     try {
       _min = _getTimeAsInt(_modifiers.min);
     } catch (error) {
       throw error;
     }
     if (_time < _min) {
       return _default;
     }
   }

   if (typeof _modifiers.max === 'string' && _modifiers.max !== '') {
     let _max = 0;
     try {
       _max = _getTimeAsInt(_modifiers.max);
     } catch (error) {
       throw error;
     }
     if (_time < _max) {
       return _default;
     }
   }

   return _getSecondsAsToD(_time);
 }

  /**
   * Get the number of seconds after midnight an ISO 8601 time string
   * represents
   *
   * @param time ISO 8601 time string
   *
   * @return Number Number of seconds after midnight time string
   *         represents
   */
  const _getTimeAsInt = (time : string) : number => {

   const _time = time.trim();
   const _regex = /^([01]?[0-9]|2[0-3])(?::([0-5][0-9])(?::([0-5][0-9]))?)?$/;

   const timeParts = _time.match(_regex);
   let _seconds : number = 0;

   if (timeParts !== null) {
     _seconds += parseInt(timeParts[1]) * 3600;
     if (typeof timeParts[2] === 'string') {
       _seconds += parseInt(timeParts[2]) * 60;
     }
     if (typeof timeParts[3] === 'string') {
       _seconds += parseInt(timeParts[3]);
     }
     return _seconds;
   } else {
     throw new Error('Could not parse time of day string');
   }
 }

 /**
  * Convert seconds in a day to ISO 8601 time string
  *
  * @param seconds Number of seconds after midnight
  *
  * @returns ISO 8601 time string
  */
 const _getSecondsAsToD = (seconds : number) : string => {
   let output = '';
   let _seconds = seconds;
   let _tmp = 0;

   if (_seconds > 3600) {
     _tmp = Math.floor(_seconds / 3600);
     output += (_tmp < 10)
       ? '0'
       : '';
     output += _tmp.toString() + ':';
     _seconds -= _tmp * 3600;
   } else {
     output += '00:';
   }

   if (_seconds > 60) {
     _tmp = Math.floor(_seconds / 60);
     output += (_tmp < 10)
       ? '0'
       : '';
     output += _tmp.toString() + ':';
     _seconds -= _tmp * 60;
   } else {
     output += '00:';
   }

   if (_seconds > 0) {
     output += (_seconds < 10)
       ? '0'
       : '';
     output += _seconds.toString();
   } else {
     output += '00';
   }

   return output;
 }

 const getTimeUnit = (str : string) : number => {
   switch (str) {
     case 'second':
       return 1;
     case 'minute':
       return 60;
     case 'hour':
       return 3600;
     case 'day':
       return 86400;
     case 'week':
       return 604800;
     case 'month':
       return 2629800;
     case 'year':
       return 31557600;
     default:
       throw new Error('could not determine time unit');
   }
 }

 export const _strToMilliseconds = (time : string) : number => {
   const _time = time.toLocaleLowerCase().trim().replace(/\s+/g, ' ');
   const _regex = /(?:(\+|-) ?)?([0-9]+(?:\.[0-9]+)?) ?(second|minute|hour|day|week|month|year)s?/g

   let seconds = 0;
   let _sign = 0;
   let matches : Array<string>|null

   while ((matches = _regex.exec(_time)) !== null) {
     if (_sign === 0) {
       _sign = (typeof matches[1] !== 'undefined' && matches[1] === '-')
         ? -1
         : 1;
     }
     const _val = parseFloat(matches[2]);
     const _unit = getTimeUnit(matches[3]);
     seconds += _val * _unit;
   }

   if (seconds !== 0) {
     console.groupEnd();
     return seconds * 1000 * _sign;
   }

   throw new Error('Could not parse relative time string');
 }

 /**
  * (VERY) Basic implementation of PHP's strtotime() function.
  *
  * expects (optional) sign plus multiple number/unit pairs
  * e.g. - 2 years, 1 month, 1.5 weeks
  *
  * @param time relative time string
  *
  * @returns Full ISO 8601 date/time string
  */
 export const strToTime = (time : string) : number => {
   let _seconds = 0;
   try {
     _seconds = _strToMilliseconds(time);
   } catch (error) {
     throw error;
   }
   const _tmp = new Date(Date.now() + _seconds);
   return _tmp.getTime();
 }
