'use strict';

var chai = require('chai');
var expect = chai.expect;
var semver = require('semver');
var fav = {}; fav.prop = require('..');

var listOwnKeys = fav.prop.listOwnKeys;

describe('fav.prop.listOwnKeys', function() {

  it('Should get all property keys when the argument is a plain object',
  function() {
    expect(listOwnKeys({})).to.have.members([]);
    expect(listOwnKeys({ a: 1, b: true, c: 'C' })).to.have.members(
      ['a', 'b', 'c']);
  });

  it('Should not get property keys of prototype', function() {
    function Fn0() {}
    Fn0.prototype.a = 1;
    expect(listOwnKeys(new Fn0())).to.have.members([]);

    function Fn1() {
      this.b = true;
      this.c = 'C';
    }
    Fn1.prototype = new Fn0();
    Fn1.prototype.d = 'D';
    Object.defineProperty(Fn1.prototype, 'e', { value: 'E' });
    expect(listOwnKeys(new Fn1())).to.have.members(['b', 'c']);
  });

  it('Should get also unenumerable property keys', function() {
    var obj = {};
    Object.defineProperties(obj, {
      a: { enumerable: true, value: 1 },
      b: { value: true },
      c: { value: 'C' },
    });
    expect(listOwnKeys(obj)).to.have.members(['a', 'b', 'c']);
  });

  it('Should return an empty array when the argument is nullish', function() {
    expect(listOwnKeys(undefined)).to.have.members([]);
    expect(listOwnKeys(null)).to.have.members([]);
  });

  it('Should return an empty array when the argument is primitive type',
  function() {
    expect(listOwnKeys(true)).to.have.members([]);
    expect(listOwnKeys(false)).to.have.members([]);
    expect(listOwnKeys(0)).to.have.members([]);
    expect(listOwnKeys(123)).to.have.members([]);
  });

  it('Should return an array having index strings and `length` when the ' +
  '\n\targument is a string', function() {
    expect(listOwnKeys('')).to.have.members(['length']);
    expect(listOwnKeys('abc')).to.have.members(['0', '1', '2', 'length']);

    var s = 'abc';
    try {
      s.aaa = 'AAA';
    } catch (e) {
      // Throws TypeError on Node.js v0.11 or later.
      //console.log(e);
    }
    expect(listOwnKeys(s)).to.have.members(['0', '1', '2', 'length']);

    try {
      Object.defineProperty(s, 'bbb', { value: 'BBB' });
    } catch (e) {
      //console.log(e);
    }
    expect(listOwnKeys(s)).to.have.members(['0', '1', '2', 'length']);
  });

  it('Should return appended property keys when the argument is a string',
  function() {
    expect(listOwnKeys(new String(''))).to.have.members(['length']);
    expect(listOwnKeys(new String('abc'))).to.have.members(
      ['0', '1', '2', 'length']);

    var s = new String('abc');
    try {
      s.aaa = 'AAA';
    } catch (e) {
      // Throws TypeError on Node.js v0.11 or later.
      //console.log(e);
    }
    expect(listOwnKeys(s)).to.have.members(['0', '1', '2', 'aaa', 'length']);

    try {
      Object.defineProperty(s, 'bbb', { value: 'BBB' });
    } catch (e) {
      //console.log(e);
    }
    expect(listOwnKeys(s)).to.have.members(
      ['0', '1', '2', 'aaa', 'bbb', 'length']);
  });

  it('Should return an array of index strings and `length` when the argument' +
  '\n\tis an array', function() {
    expect(listOwnKeys([])).to.have.members(['length']);
    expect(listOwnKeys([1, 2, 3])).to.have.members(['0', '1', '2', 'length']);

    var a = ['a', 'b'];
    a.aaa = 'AAA';
    expect(listOwnKeys(a)).to.have.members(['0', '1', 'aaa', 'length']);

    try {
      Object.defineProperty(a, 'bbb', { value: 'BBB' });
    } catch (e) {
      //console.log(e);
    }
    expect(listOwnKeys(a)).to.have.members(['0', '1', 'aaa', 'bbb', 'length']);
  });

  it('Should return property keys when the argument is a function',
  function() {
    expect(listOwnKeys(function() {})).to.have.members(
      ['length', 'name', 'prototype']);

    if (isSupportArrowFunction()) {
      eval('expect(listOwnKeys(() => {})).to.have.members(' +
        '["length", "name"])');
    }

    if (isSupportGenerator()) {
      eval('expect(listOwnKeys(function *genFn() {})).to.have.members(' +
        '["length", "name", "prototype"])');
    }

    if (isSupportAsyncAwait()) {
      eval('expect(listOwnKeys(async function asyncFn() {})).to.have.' +
        'members(["length", "name"])');
    }
  });

  it('Should return `length`, `name`, `prototype` and appended property ' +
  'keys\n\twhen the argument is a function', function() {
    var fn = function() {};
    expect(listOwnKeys(fn)).to.have.members(['length', 'name', 'prototype']);

    fn.aaa = 'AAA';
    expect(listOwnKeys(fn)).to.have.members(
      ['length', 'name', 'prototype', 'aaa']);

    Object.defineProperty(fn, 'bbb', { value: 'BBB' });
    expect(listOwnKeys(fn)).to.have.members(
      ['length', 'name', 'prototype', 'aaa', 'bbb']);
  });

  it('Should return an empty string when the argument is a symbol',
  function() {
    if (typeof Symbol !== 'function') {
      this.skip();
      return;
    }

    var symbol = Symbol('foo');
    expect(listOwnKeys(symbol)).to.have.members([]);

    try {
      symbol.aaa = 'AAA';
    } catch (e) {
      // console.error(e);
    }
    expect(listOwnKeys(symbol)).to.have.members([]);

    try {
      Object.defineProperty(symbol, 'bbb', { value: 'BBB' });
    } catch (e) {
      // console.error(e);
    }
    expect(listOwnKeys(symbol)).to.have.members([]);
  });
});


function isSupportArrowFunction() {
  if (isNode()) {
    return semver.gte(process.version, '4.0.0');
  }

  if (typeof xslet !== 'undefined' && typeof xslet.platform !== 'undefined') {
    var ua = xslet.platform.ua;

    // Check by latest version
    if (ua.CHROME) {
      return true;
    }
    if (ua.FIREFOX) {
      return true;
    }
    if (ua.MSIE) {
      return true;
    }
    if (ua.EDGE) {
      return true;
    }
    if (ua.SAFARI) {
      return true;
    }
    if (ua.VIVALDI) {
      return true;
    }
    if (ua.PHANTOMJS) {
      return true;
    }

    return false;
  }

  return false;
}

function isSupportAsyncAwait() {
  if (isNode()) {
    return semver.gte(process.version, '7.6.0');
  }

  if (typeof xslet !== 'undefined' && typeof xslet.platform !== 'undefined') {
    var ua = xslet.platform.ua;

    // Check by latest version
    if (ua.CHROME) {
      return true;
    }
    if (ua.FIREFOX) {
      return true;
    }
    if (ua.MSIE) {
      return true;
    }
    if (ua.EDGE) {
      return true;
    }
    if (ua.SAFARI) {
      return true;
    }
    if (ua.VIVALDI) {
      return true;
    }
    if (ua.PHANTOMJS) {
      return false;
    }

    return false;
  }

  return false;
}

function isSupportGenerator() {
  if (isNode()) {
    return semver.gte(process.version, '4.0.0');
  }

  if (typeof xslet !== 'undefined' && typeof xslet.platform !== 'undefined') {
    var ua = xslet.platform.ua;

    // Check by latest version
    if (ua.CHROME) {
      return true;
    }
    if (ua.FIREFOX) {
      return true;
    }
    if (ua.MSIE) {
      return true;
    }
    if (ua.EDGE) {
      return true;
    }
    if (ua.SAFARI) {
      return true;
    }
    if (ua.VIVALDI) {
      return true;
    }
    if (ua.PHANTOMJS) {
      return false;
    }
  }

  return false;
}

function isNode() {
  if (typeof process === 'object') {
    if (typeof process.kill === 'function') { // exists from v0.0.6
      return true;
    }
  }
  return false;
}
