'use strict';

var assign = require('@fav/prop.assign');
var assignDeep = require('@fav/prop.assign-deep');
var defaults = require('@fav/prop.defaults');
var defaultsDeep = require('@fav/prop.defaults-deep');
var define = require('@fav/prop.define');
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
  define:         { enumerable: true, value: define },
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
