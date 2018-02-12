(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}(g.fav || (g.fav = {})).prop = f()}})(function(){var define,module,exports;return (function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
'use strict';

var assign = require('@fav/prop.assign');
var assignDeep = require('@fav/prop.assign-deep');
var defaults = require('@fav/prop.defaults');
var defaultsDeep = require('@fav/prop.defaults-deep');
var enumAllKeys = require('@fav/prop.enum-all-keys');
var enumAllProps = require('@fav/prop.enum-all-props');
var enumAllSymbols = require('@fav/prop.enum-all-symbols');
var enumOwnKeys = require('@fav/prop.enum-own-keys');
var enumOwnProps = require('@fav/prop.enum-own-props');
var enumOwnSymbols = require('@fav/prop.enum-own-symbols');
var getDeep = require('@fav/prop.get-deep');
var listOwnKeys = require('@fav/prop.list-own-keys');
var listOwnProps = require('@fav/prop.list-own-props');
var listOwnSymbols = require('@fav/prop.list-own-symbols');
var omit = require('@fav/prop.omit');
var omitDeep = require('@fav/prop.omit-deep');
var pick = require('@fav/prop.pick');
var pickDeep = require('@fav/prop.pick-deep');
var setDeep = require('@fav/prop.set-deep');
var visit = require('@fav/prop.visit');

var prop = {};

Object.defineProperties(prop, {
  assign:         { enumerable: true, value: assign },
  assignDeep:     { enumerable: true, value: assignDeep },
  defaults:       { enumerable: true, value: defaults },
  defaultsDeep:   { enumerable: true, value: defaultsDeep },
  enumAllKeys:    { enumerable: true, value: enumAllKeys },
  enumAllProps:   { enumerable: true, value: enumAllProps },
  enumAllSymbols: { enumerable: true, value: enumAllSymbols },
  enumOwnKeys:    { enumerable: true, value: enumOwnKeys },
  enumOwnProps:   { enumerable: true, value: enumOwnProps },
  enumOwnSymbols: { enumerable: true, value: enumOwnSymbols },
  getDeep:        { enumerable: true, value: getDeep },
  listOwnKeys:    { enumerable: true, value: listOwnKeys },
  listOwnProps:   { enumerable: true, value: listOwnProps },
  listOwnSymbols: { enumerable: true, value: listOwnSymbols },
  omit:           { enumerable: true, value: omit },
  omitDeep:       { enumerable: true, value: omitDeep },
  pick:           { enumerable: true, value: pick },
  pickDeep:       { enumerable: true, value: pickDeep },
  setDeep:        { enumerable: true, value: setDeep },
  visit:          { enumerable: true, value: visit },
});

module.exports = prop;

},{"@fav/prop.assign":3,"@fav/prop.assign-deep":2,"@fav/prop.defaults":5,"@fav/prop.defaults-deep":4,"@fav/prop.enum-all-keys":6,"@fav/prop.enum-all-props":7,"@fav/prop.enum-all-symbols":8,"@fav/prop.enum-own-keys":9,"@fav/prop.enum-own-props":10,"@fav/prop.enum-own-symbols":11,"@fav/prop.get-deep":12,"@fav/prop.list-own-keys":13,"@fav/prop.list-own-props":14,"@fav/prop.list-own-symbols":15,"@fav/prop.omit":17,"@fav/prop.omit-deep":16,"@fav/prop.pick":19,"@fav/prop.pick-deep":18,"@fav/prop.set-deep":20,"@fav/prop.visit":21}],2:[function(require,module,exports){
'use strict';

var isPlainObject = require('@fav/type.is-plain-object');
var enumOwnProps = require('@fav/prop.enum-own-props');

function assignDeep(dest /* , ...src */) {
  if (!isPlainObject(dest)) {
    dest = {};
  }

  for (var i = 1, n = arguments.length; i < n; i++) {
    assignDeepEach(dest, arguments[i]);
  }
  return dest;
}

function assignDeepEach(dest, src) {
  var props = enumOwnProps(src);
  for (var i = 0, n = props.length; i < n; i++) {
    var prop = props[i];
    var srcValue = src[prop];

    if (isPlainObject(srcValue)) {
      var destValue = dest[prop];

      if (!isPlainObject(destValue)) {
        try {
          dest[prop] = destValue = {};
        } catch (e) {
          // If a property is read only, TypeError is thrown,
          // but this function ignore it.
        }
      }

      assignDeepEach(destValue, srcValue);
      continue;
    }

    try {
      dest[prop] = srcValue;
    } catch (e) {
      // If a property is read only, TypeError is thrown,
      // but this function ignore it.
    }
  }
}

module.exports = assignDeep;

},{"@fav/prop.enum-own-props":10,"@fav/type.is-plain-object":24}],3:[function(require,module,exports){
'use strict';

var enumOwnProps = require('@fav/prop.enum-own-props');

function assign(dest /* , src, ... */) {
  dest = new Object(dest);

  for (var i = 1, n = arguments.length; i < n; i++) {
    assignEach(dest, arguments[i]);
  }

  return dest;
}

function assignEach(dest, src) {
  var props = enumOwnProps(src);
  for (var i2 = 0, n2 = props.length; i2 < n2; i2++) {
    var prop = props[i2];
    try {
      dest[prop] = src[prop];
    } catch (e) {
      // If a property is read only, TypeError is thrown,
      // but this funciton ignores it.
    }
  }
}

module.exports = assign;

},{"@fav/prop.enum-own-props":10}],4:[function(require,module,exports){
'use strict';

var enumOwnProps = require('@fav/prop.enum-own-props');
var isPlainObject = require('@fav/type.is-plain-object');

function defaultsDeep(dest /* , ...src */) {
  if (!isPlainObject(dest)) {
    dest = {};
  }

  for (var i = 1, n = arguments.length; i < n; i++) {
    defaultsDeepEach(dest, arguments[i]);
  }
  return dest;
}

function defaultsDeepEach(dest, src) {
  var props = enumOwnProps(src);
  for (var i = 0, n = props.length; i < n; i++) {
    var prop = props[i];
    var srcProp = src[prop];
    var destProp = dest[prop];

    if (isPlainObject(srcProp)) {
      if (destProp == null) {
        dest[prop] = destProp = {};
      } else if (!isPlainObject(destProp)) {
        continue;
      }
      defaultsDeepEach(destProp, srcProp);
      continue;
    }

    if (destProp != null) {
      continue;
    }

    if (srcProp == null) {
      continue;
    }

    try {
      dest[prop] = srcProp;
    } catch (e) {
      // If a property is read only, TypeError is thrown,
      // but this function ignore it.
    }
  }
}

module.exports = defaultsDeep;

},{"@fav/prop.enum-own-props":10,"@fav/type.is-plain-object":24}],5:[function(require,module,exports){
'use strict';

var enumOwnProps = require('@fav/prop.enum-own-props');

function defaults(dest /* , ...src */) {
  if (dest == null) {
    dest = {};
  } else {
    dest = new Object(dest);
  }

  for (var i = 1, n = arguments.length; i < n; i++) {
    defaultsEach(dest, arguments[i]);
  }
  return dest;
}

function defaultsEach(dest, src) {
  var props = enumOwnProps(src);
  for (var i = 0, n = props.length; i < n; i++) {
    var prop = props[i];

    if (dest[prop] != null) {
      continue;
    }

    if (src[prop] == null) {
      continue;
    }

    try {
      dest[prop] = src[prop];
    } catch (e) {
      // If a property is read only, TypeError is thrown,
      // but this function ignores it.
    }
  }
}

module.exports = defaults;

},{"@fav/prop.enum-own-props":10}],6:[function(require,module,exports){
'use strict';

function enumAllKeys(obj) {
  switch (typeof obj) {
    case 'string': {
      obj = new String(obj);
    }
    case 'object':
    case 'function': {
      var keys = [];
      for (var key in obj) {
        keys.push(key);
      }
      return keys;
    }
    default: {
      return [];
    }
  }
}

module.exports = enumAllKeys;

},{}],7:[function(require,module,exports){
'use strict';

var enumAllKeys = require('@fav/prop.enum-all-keys');
var enumAllSymbols = require('@fav/prop.enum-all-symbols');

function enumAllProps(obj) {
  return enumAllKeys(obj).concat(enumAllSymbols(obj));
}

module.exports = enumAllProps;

},{"@fav/prop.enum-all-keys":6,"@fav/prop.enum-all-symbols":8}],8:[function(require,module,exports){
'use strict';

function enumAllSymbols(obj) {
  /* istanbul ignore if */
  if (typeof Symbol !== 'function') {
    return [];
  }

  switch (typeof obj) {
    case 'object': {
      obj = obj || {};
      break;
    }
    case 'function': {
      break;
    }
    default: {
      return [];
    }
  }

  var ret = [];
  while (obj) {
    var symbols = Object.getOwnPropertySymbols(obj);
    for (var i = symbols.length - 1; i >= 0; i--) {
      var descriptor = Object.getOwnPropertyDescriptor(obj, symbols[i]);
      if (!descriptor.enumerable) {
        symbols.splice(i, 1);
      }
    }
    ret = ret.concat(symbols);

    obj = Object.getPrototypeOf(obj);
  }
  return ret;
}

module.exports = enumAllSymbols;

},{}],9:[function(require,module,exports){
'use strict';

function enumOwnKeys(obj) {
  switch (typeof obj) {
    case 'object': {
      return Object.keys(obj || {});
    }
    case 'function': {
      return Object.keys(obj);
    }

    // Cause TypeError on Node.js v0.12 or earlier.
    case 'string': {
      return Object.keys(new String(obj));
    }
    default: {
      return [];
    }
  }
}

module.exports = enumOwnKeys;

},{}],10:[function(require,module,exports){
'use strict';

var enumOwnKeys = require('@fav/prop.enum-own-keys');
var enumOwnSymbols = require('@fav/prop.enum-own-symbols');

function enumOwnProps(obj) {
  return enumOwnKeys(obj).concat(enumOwnSymbols(obj));
}

module.exports = enumOwnProps;

},{"@fav/prop.enum-own-keys":9,"@fav/prop.enum-own-symbols":11}],11:[function(require,module,exports){
'use strict';

function enumOwnSymbols(obj) {
  /* istanbul ignore if */
  if (typeof Symbol !== 'function') {
    return [];
  }

  switch (typeof obj) {
    case 'object': {
      obj = obj || {};
      break;
    }
    case 'function': {
      break;
    }
    default: {
      return [];
    }
  }

  var symbols = Object.getOwnPropertySymbols(obj);
  for (var i = symbols.length - 1; i >= 0; i--) {
    var descriptor = Object.getOwnPropertyDescriptor(obj, symbols[i]);
    if (!descriptor.enumerable) {
      symbols.splice(i, 1);
    }
  }
  return symbols;
}

module.exports = enumOwnSymbols;

},{}],12:[function(require,module,exports){
'use strict';

var isArray = require('@fav/type.is-array');

function getDeep(obj, propPath) {
  if (arguments.length < 2) {
    return obj;
  }

  if (!isArray(propPath)) {
    return undefined;
  }

  if (obj == null) {
    return Boolean(propPath.length) ? undefined : obj;
  }

  for (var i = 0, n = propPath.length; i < n; i++) {
    var prop = propPath[i];
    if (Array.isArray(prop)) {
      // This function doesn't allow to use an array as a property.
      return undefined;
    }

    obj = obj[prop];
    if (obj == null) {
      break;
    }
  }

  return obj;
}

module.exports = getDeep;

},{"@fav/type.is-array":22}],13:[function(require,module,exports){
'use strict';

function listOwnKeys(obj) {
  switch (typeof obj) {
    case 'object': {
      return Object.getOwnPropertyNames(obj || {});
    }
    case 'string': {
      obj = new String(obj);
      return Object.getOwnPropertyNames(obj);
    }
    case 'function': {
      var arr = Object.getOwnPropertyNames(obj);
      var hasName = false;
      for (var i = arr.length - 1; i >= 0; i--) {
        var key = arr[i];
        /* istanbul ignore next */
        switch (key) {
          case 'caller':
          case 'arguments': {
            arr.splice(i, 1);
            break;
          }
          case 'name': {
            hasName = true;
            break;
          }
        }
      }
      /* istanbul ignore if */
      if (!hasName) { // A function don't have `name` prop on IE
        arr.push('name');
      }
      return arr;
    }
    default: {
      return [];
    }
  }
}

module.exports = listOwnKeys;

},{}],14:[function(require,module,exports){
'use strict';

var listOwnKeys = require('@fav/prop.list-own-keys');
var listOwnSymbols = require('@fav/prop.list-own-symbols');

function listOwnProps(obj) {
  return listOwnKeys(obj).concat(listOwnSymbols(obj));
}

module.exports = listOwnProps;

},{"@fav/prop.list-own-keys":13,"@fav/prop.list-own-symbols":15}],15:[function(require,module,exports){
'use strict';

function listOwnSymbols(obj) {
  /* istanbul ignore if */
  if (typeof Symbol !== 'function') {
    return [];
  }

  switch (typeof obj) {
    case 'object': {
      obj = obj || [];
      break;
    }
    case 'function': {
      break;
    }
    default: {
      return [];
    }
  }

  return Object.getOwnPropertySymbols(obj);
}

module.exports = listOwnSymbols;

},{}],16:[function(require,module,exports){
'use strict';

var assignDeep = require('@fav/prop.assign-deep');
var getDeep = require('@fav/prop.get-deep');
var isArray = require('@fav/type.is-array');

function omitDeep(src, omittedPropPaths) {
  var dest = assignDeep({}, src);

  if (omittedPropPaths == null) {
    return dest;
  }

  if (!isArray(omittedPropPaths)) {
    return dest;
  }

  for (var i = 0, n = omittedPropPaths.length; i < n; i++) {
    omitDeepEach(dest, omittedPropPaths[i]);
  }
  return dest;
}

function omitDeepEach(dest, propPath) {
  if (!isArray(propPath)) {
    return;
  }

  var parentPath = propPath.slice(0, -1);
  var parentNode = getDeep(dest, parentPath);
  if (!parentNode) {
    return;
  }

  var lastProp = propPath[propPath.length - 1];
  if (isArray(lastProp)) {
    // This function doesn't allow to use an array as a property.
    return;
  }

  delete parentNode[lastProp];
}

module.exports = omitDeep;

},{"@fav/prop.assign-deep":2,"@fav/prop.get-deep":12,"@fav/type.is-array":22}],17:[function(require,module,exports){
'use strict';

var assign = require('@fav/prop.assign');
var isArray = require('@fav/type.is-array');

function omit(src, omittedProps) {
  var dest = assign({}, src);

  if (!isArray(omittedProps)) {
    return dest;
  }

  for (var j = 0, nj = omittedProps.length; j < nj; j++) {
    var omitted = omittedProps[j];
    if (isArray(omitted)) {
      // This function doesn't allow to use an array as a property.
      continue;
    }
    delete dest[omitted];
  }
  return dest;
}

module.exports = omit;

},{"@fav/prop.assign":3,"@fav/type.is-array":22}],18:[function(require,module,exports){
'use strict';

var setDeep = require('@fav/prop.set-deep');
var assignDeep = require('@fav/prop.assign-deep');
var isArray = require('@fav/type.is-array');
var isPlainObject = require('@fav/type.is-plain-object');

function pickDeep(src, pickedPropPaths) {
  if (!isArray(pickedPropPaths)) {
    return {};
  }

  var dest = {};

  for (var i = 0, n = pickedPropPaths.length; i < n; i++) {
    pickDeepEach(dest, src, pickedPropPaths[i]);
  }

  return dest;
}

function pickDeepEach(dest, src, pickedPropPath) {
  if (!isArray(pickedPropPath) || !pickedPropPath.length) {
    return;
  }

  var parent = getEnumOwnPropDeep(src, pickedPropPath.slice(0, -1));
  if (parent == null) {
    return;
  }

  var lastProp = pickedPropPath[pickedPropPath.length - 1];
  if (!isEnumOwnPropDesc(parent, lastProp)) {
    return;
  }

  var value = parent[lastProp];
  if (isPlainObject(value)) {
    value = assignDeep({}, value);
  }

  setDeep(dest, pickedPropPath, value);
}

function getEnumOwnPropDeep(obj, propPath) {
  for (var i = 0, n = propPath.length; i < n; i++) {
    var prop = propPath[i];
    if (!isEnumOwnPropDesc(obj, prop)) {
      return undefined;
    }
    obj = obj[prop];
  }
  return obj;
}

function isEnumOwnPropDesc(obj, prop) {
  if (isArray(prop)) {
    // This function doesn't allow to use an array as a property.
    return false;
  }

  var desc = Object.getOwnPropertyDescriptor(Object(obj), prop);
  return Boolean(desc && desc.enumerable);
}

module.exports = pickDeep;

},{"@fav/prop.assign-deep":2,"@fav/prop.set-deep":20,"@fav/type.is-array":22,"@fav/type.is-plain-object":24}],19:[function(require,module,exports){
'use strict';

var assign = require('@fav/prop.assign');
var enumOwnProps = require('@fav/prop.enum-own-props');
var isArray = require('@fav/type.is-array');

function pick(src, pickedProps) {
  if (!isArray(pickedProps)) {
    return {};
  }

  var dest = {};

  if (pickedProps.length <= 100) { // 100 is empirical
    var props = enumOwnProps(src);
    for (var i = 0, n = props.length; i < n; i++) {
      var prop = props[i];
      if (pickedProps.indexOf(prop) >= 0) {
        dest[prop] = src[prop];
      }
    }
    return dest;
  }

  src = assign({}, src);
  for (var j = 0, nj = pickedProps.length; j < nj; j++) {
    var picked = pickedProps[j];
    if (isArray(picked)) {
      // This function doesn't allow to use an array as a property.
      continue;
    }
    if (picked in src) {
      dest[picked] = src[picked];
    }
  }
  return dest;
}

module.exports = pick;

},{"@fav/prop.assign":3,"@fav/prop.enum-own-props":10,"@fav/type.is-array":22}],20:[function(require,module,exports){
'use strict';

var isArray = require('@fav/type.is-array');

function setDeep(obj, propPath, value) {
  if (arguments.length < 3) {
    return;
  }

  if (!isArray(propPath)) {
    return;
  }

  if (!canHaveProp(obj)) {
    return;
  }

  var i, last = propPath.length - 1;

  for (i = 0; i < last; i++) {
    var existentProp = propPath[i];
    if (isArray(existentProp)) {
      // This function doesn't allow to use an array as a property.
      return;
    }

    var child = obj[existentProp];
    if (!canHaveProp(child)) {
      break;
    }
    obj = child;
  }

  for (var j = last; j > i; j--) {
    var nonExistentProp = propPath[j];
    if (isArray(nonExistentProp)) {
      // This function doesn't allow to use an array as a property.
      return;
    }

    var parent = {};
    parent[nonExistentProp] = value;
    value = parent;
  }

  try {
    var graftedProp = propPath[i];
    if (isArray(graftedProp)) {
      // This function doesn't allow to use an array as a property.
      return;
    }
    obj[graftedProp] = value;
  } catch (e) {
    // If a property is read only, TypeError is thrown,
    // but this function ignores it.
  }
}

function canHaveProp(obj) {
  switch (typeof obj) {
    case 'object': {
      return (obj != null);
    }
    case 'function': {
      return true;
    }
    default: {
      return false;
    }
  }
}

module.exports = setDeep;

},{"@fav/type.is-array":22}],21:[function(require,module,exports){
'use strict';

var isPlainObject = require('@fav/type.is-plain-object');
var isFunction = require('@fav/type.is-function');
var enumOwnProps = require('@fav/prop.enum-own-props');

function visit(obj, fn) {
  if (!isPlainObject(obj)) {
    return;
  }

  if (!isFunction(fn)) {
    return;
  }

  visitEachProps(obj, fn, 0, 1, []);
}

function visitEachProps(obj, fn, index, count, parentProps) {
  var props = enumOwnProps(obj);
  for (var i = 0, n = props.length; i < n; i++) {
    var prop = props[i];
    var val = obj[prop];

    var stopDigging = fn.call(this, prop, val, i, n, parentProps, obj);

    if (!stopDigging && isPlainObject(val)) {
      visitEachProps(val, fn, i, n, parentProps.concat(prop));
    }
  }
}

module.exports = visit;

},{"@fav/prop.enum-own-props":10,"@fav/type.is-function":23,"@fav/type.is-plain-object":24}],22:[function(require,module,exports){
'use strict';

function isArray(value) {
  return Array.isArray(value);
}

function isNotArray(value) {
  return !Array.isArray(value);
}

Object.defineProperty(isArray, 'not', {
  enumerable: true,
  value: isNotArray,
});

module.exports = isArray;

},{}],23:[function(require,module,exports){
'use strict';

function isFunction(value) {
  return (typeof value === 'function');
}

function isNotFunction(value) {
  return (typeof value !== 'function');
}

Object.defineProperty(isFunction, 'not', {
  enumerable: true,
  value: isNotFunction,
});

module.exports = isFunction;

},{}],24:[function(require,module,exports){
'use strict';

function isPlainObject(value) {
  if (typeof value !== 'object') {
    return false;
  }

  if (Object.prototype.toString.call(value) !== '[object Object]') {
    return false;
  }

  switch (Object.getPrototypeOf(value)) {
    case Object.prototype: {
      return true;
    }
    case null: {
      return true;
    }
    default: {
      return false;
    }
  }
}

function isNotPlainObject(value) {
  return !isPlainObject(value);
}

Object.defineProperty(isPlainObject, 'not', {
  enumerable: true,
  value: isNotPlainObject,
});

module.exports = isPlainObject;

},{}]},{},[1])(1)
});