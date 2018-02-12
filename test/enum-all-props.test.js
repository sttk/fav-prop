'use strict';

var chai = require('chai');
var expect = chai.expect;

var fav = {}; fav.prop = require('..');

var enumAllProps = fav.prop.enumAllProps;

describe('fav.prop.enumAllProps', function() {

  it('Should get all props when the argument is a plain object', function() {
    expect(enumAllProps({})).to.have.members([]);

    var obj = { a: 1 };

    if (typeof Symbol !== 'function') {
      expect(enumAllProps(obj)).to.have.members(['a']);
    } else {
      var s0 = Symbol('foo');
      obj[s0] = 2;
      expect(enumAllProps(obj)).to.have.members(['a', s0]);
    }
  });

  it('Should get properties of prototype', function() {
    var sym0, sym1, sym2;
    if (typeof Symbol === 'function') {
      sym0 = Symbol('sym-0');
      sym1 = Symbol('sym-1');
      sym2 = Symbol('sym-2');
    }

    function Fn0() {}
    Fn0.prototype.a = 1;
    if (typeof Symbol === 'function') {
      Fn0.prototype[sym0] = 2;
    }

    function Fn1() {
      this.b = true;
      if (typeof Symbol === 'function') {
        this[sym1] = false;
      }
    }
    Fn1.prototype = new Fn0();
    Fn1.prototype.c = 'C';
    if (typeof Symbol === 'function') {
      Fn1.prototype[sym2] = 'S';
      expect(enumAllProps(new Fn1())).to.have.members([
        'a', 'b', 'c', sym0, sym1, sym2]);
    } else {
      expect(enumAllProps(new Fn1())).to.have.members(['a', 'b', 'c']);
    }
  });

  it('Should get only enumerable props', function() {
    var sym0, sym1;
    if (typeof Symbol === 'function') {
      sym0 = Symbol('sym-0');
      sym1 = Symbol('sym-1');
    }

    var obj = {};
    Object.defineProperty(obj, 'a', { enumerable: true, value: 1 });
    Object.defineProperty(obj, 'b', { value: 3 });
    if (typeof Symbol === 'function') {
      Object.defineProperty(obj, sym0, { enumerable: true, value: 2 });
      Object.defineProperty(obj, sym1, { value: 4 });
    }

    if (typeof Symbol === 'function') {
      expect(enumAllProps(obj)).to.have.members(['a', sym0]);
    } else {
      expect(enumAllProps(obj)).to.have.members(['a']);
    }
  });

  it('Should return an empty array when the argument is nullish', function() {
    expect(enumAllProps(undefined)).to.have.members([]);
    expect(enumAllProps(null)).to.have.members([]);
  });

  it('Should return an empty array when the argument is primitive type',
  function() {
    expect(enumAllProps(true)).to.have.members([]);
    expect(enumAllProps(false)).to.have.members([]);
    expect(enumAllProps(0)).to.have.members([]);
    expect(enumAllProps(123)).to.have.members([]);
  });

  it('Should return an empty array when the argument is a string',
  function() {
    var sym0, sym1;
    if (typeof Symbol === 'function') {
      sym0 = Symbol('symbol 0');
      sym1 = Symbol('symbol 1');
    }

    expect(enumAllProps('')).to.have.members([]);
    expect(enumAllProps('abc')).to.have.members(['0', '1', '2']);

    var s = 'abc';
    try {
      s.aaa = 'AAA';
    } catch (e) {
      // Throws TypeError on Node.js v0.11 or later.
    }
    if (typeof Symbol === 'function') {
      try {
        s[sym0] = 'S0';
      } catch (e) {
        // Throws TypeError on Node.js v0.11 or later.
      }
    }
    expect(enumAllProps(s)).to.have.members(['0', '1', '2']);

    try {
      Object.defineProperty(s, 'bbb', { value: 'BBB' });
    } catch (e) {
      // Throws TypeError on Node.js v0.11 or later.
    }
    try {
      Object.defineProperty(s, sym1, { value: 'S1' });
    } catch (e) {
      // Throws TypeError on Node.js v0.11 or later.
    }
    expect(enumAllProps(s)).to.have.members(['0', '1', '2']);
  });

  it('Should return an array of index strings when the argument is a array',
  function() {
    expect(enumAllProps([])).to.have.members([]);
    expect(enumAllProps([1, 2, 3])).to.have.members(['0', '1', '2']);

    var sym0, sym1;
    if (typeof Symbol === 'function') {
      sym0 = Symbol('1234');
      sym1 = Symbol('5678');
    }

    var a = ['a', 'b'];
    a.aaa = 'AAA';
    if (typeof Symbol === 'function') {
      a[sym0] = 'S0';
      expect(enumAllProps(a)).to.have.members(['0', '1', 'aaa', sym0]);
    } else {
      expect(enumAllProps(a)).to.have.members(['0', '1', 'aaa']);
    }

    Object.defineProperty(a, 'bbb', { value: 'BBB' });
    if (typeof Symbol === 'function') {
      Object.defineProperty(a, sym1, { value: 'S1' });
      expect(enumAllProps(a)).to.have.members(['0', '1', 'aaa', sym0]);
    } else {
      expect(enumAllProps(a)).to.have.members(['0', '1', 'aaa']);
    }
  });

});
