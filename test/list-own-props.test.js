'use strict';

var chai = require('chai');
var expect = chai.expect;
var fav = {}; fav.prop = require('..');

var listOwnProps = fav.prop.listOwnProps;

describe('fav.prop.listOwnProps', function() {

  it('Should get all own props when arg is a plain object', function() {
    expect(listOwnProps({})).to.have.members([]);

    var obj = { a: 1 };

    var s0;
    if (typeof Symbol !== 'function') {
      expect(listOwnProps(obj)).to.have.members(['a']);
    } else {
      s0 = Symbol('foo');
      obj[s0] = 2;
      expect(listOwnProps(obj)).to.have.members(['a', s0]);
    }
  });

  it('Should not get props of prototype', function() {
    var sym0, sym1, sym2;
    if (typeof Symbol === 'function') {
      sym0 = Symbol('foo');
      sym1 = Symbol('bar');
      sym2 = Symbol('baz');
    }

    function Fn0() {}
    Fn0.prototype.a = 1;
    if (typeof Symbol === 'function') {
      Fn0.prototype[sym0] = 2;
    }
    expect(listOwnProps(new Fn0())).to.have.members([]);

    function Fn1() {
      this.b = true;
      if (typeof Symbol === 'function') {
        this[sym1] = false;
      }
    }
    Fn1.prototype = new Fn0();
    Fn1.prototype.d = 'D';
    Object.defineProperty(Fn1.prototype, 'e', { value: 'E' });
    if (typeof Symbol === 'function') {
      Fn1.prototype[sym2] = 'S';
      Object.defineProperty(Fn1.prototype, 'sym3', { value: 'SS' });
    }

    if (typeof Symbol === 'function') {
      expect(listOwnProps(new Fn1())).to.have.members(['b', sym1]);
    } else {
      expect(listOwnProps(new Fn1())).to.have.members(['b']);
    }
  });

  it('Should get also unenumerable props', function() {
    var sym0, sym1;
    if (typeof Symbol === 'function') {
      sym0 = Symbol('foo');
      sym1 = Symbol('bar');
    }

    var obj = {};
    Object.defineProperty(obj, 'a', { enumerable: true, value: 1 });
    Object.defineProperty(obj, 'b', { value: 2 });
    if (typeof Symbol === 'function') {
      Object.defineProperty(obj, sym0, { enumerable: true, value: 3 });
      Object.defineProperty(obj, sym1, { value: 4 });
    }

    if (typeof Symbol === 'function') {
      expect(listOwnProps(obj)).to.have.members(['a', 'b', sym0, sym1]);
    } else {
      expect(listOwnProps(obj)).to.have.members(['a', 'b']);
    }
  });

  it('Should return an empty array when the argument is nullish', function() {
    expect(listOwnProps(undefined)).to.have.members([]);
    expect(listOwnProps(null)).to.have.members([]);
  });

  it('Should return an empty array when the argument is primitive type',
  function() {
    expect(listOwnProps(true)).to.have.members([]);
    expect(listOwnProps(false)).to.have.members([]);
    expect(listOwnProps(0)).to.have.members([]);
    expect(listOwnProps(123)).to.have.members([]);
  });

  it('Should return an array having index strings and `length` when the ' +
  '\n\targument is a string', function() {
    expect(listOwnProps('')).to.have.members(['length']);
    expect(listOwnProps('abc')).to.have.members(['0', '1', '2', 'length']);

    var sym0;
    if (typeof Symbol === 'function') {
      sym0 = Symbol('0');
    }

    var s = 'abc';
    try {
      s.aaa = 'AAA';
    } catch (e) {
      // Throws TypeError on Node.js v0.11 or later.
    }
    if (typeof Symbol === 'function') {
      try {
        s[sym0] = 'aaa';
      } catch (e) {
        // Throws TypeError on Node.js v0.11 or later.
      }
    }

    expect(listOwnProps(s)).to.have.members(['0', '1', '2', 'length']);

    try {
      Object.defineProperty(s, 'bbb', { value: 'BBB' });
    } catch (e) {
      //console.log(e);
    }
    expect(listOwnProps(s)).to.have.members(['0', '1', '2', 'length']);
  });

  it('Should return appended props when the argument is a atring', function() {
    expect(listOwnProps(new String(''))).to.have.members(['length']);
    expect(listOwnProps(new String('abc'))).to.have.members(
      ['0', '1', '2', 'length']);

    var s = new String('abc');
    try {
      s.aaa = 'AAA';
    } catch (e) {
      // Throws TypeError on Node.js v0.11 or later.
      //console.log(e);
    }
    expect(listOwnProps(s)).to.have.members(
      ['0', '1', '2', 'aaa', 'length']);

    try {
      Object.defineProperty(s, 'bbb', { value: 'BBB' });
    } catch (e) {
      //console.log(e);
    }
    expect(listOwnProps(s)).to.have.members(
      ['0', '1', '2', 'aaa', 'bbb', 'length']);
  });

  it('Should return props of an array of index strings and `length` when ' +
  '\n\tthe argument is an array', function() {
    expect(listOwnProps([])).to.have.members(['length']);
    expect(listOwnProps([1, 2, 3])).to.have.members(
      ['0', '1', '2', 'length']);

    var a = ['a', 'b'];
    a.aaa = 'AAA';
    expect(listOwnProps(a)).to.have.members(
      ['0', '1', 'aaa', 'length']);

    try {
      Object.defineProperty(a, 'bbb', { value: 'BBB' });
    } catch (e) {
      //console.log(e);
    }
    expect(listOwnProps(a)).to.have.members(
      ['0', '1', 'aaa', 'bbb', 'length']);
  });

  it('Should return `length`, `name`, `prototype` props and appended props ' +
  '\n\twhen the argument is a function', function() {
    var fn = function f() {};
    expect(listOwnProps(fn)).to.have.members(
      ['length', 'name', 'prototype']);

    fn.aaa = 'AAA';
    expect(listOwnProps(fn)).to.have.members(
      ['length', 'name', 'prototype', 'aaa']);

    Object.defineProperty(fn, 'bbb', { value: 'BBB' });
    expect(listOwnProps(fn)).to.have.members(
      ['length', 'name', 'prototype', 'aaa', 'bbb']);
  });

  it('Should return an empty string when the argument is a symbol',
  function() {
    if (typeof Symbol !== 'function') {
      this.skip();
      return;
    }

    var symbol = Symbol('foo');
    expect(listOwnProps(symbol)).to.have.members([]);

    try {
      symbol.aaa = 'AAA';
    } catch (e) {
      // console.error(e);
    }
    expect(listOwnProps(symbol)).to.have.members([]);

    try {
      Object.defineProperty(symbol, 'bbb', { value: 'BBB' });
    } catch (e) {
      // console.error(e);
    }
    expect(listOwnProps(symbol)).to.have.members([]);
  });
});
