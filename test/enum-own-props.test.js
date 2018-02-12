'use strict';

var chai = require('chai');
var expect = chai.expect;

var fav = {}; fav.prop = require('..');

var enumOwnProps = fav.prop.enumOwnProps;

describe('fav.prop.enumOwnProps', function() {

  it('Should get enumerable prop keys and symbols when arg is a plain object',
  function() {
    expect(enumOwnProps({})).to.have.members([]);

    var obj = { a: 1 };

    var s0;
    if (typeof Symbol !== 'function') {
      expect(enumOwnProps(obj)).to.have.members(['a']);
    } else {
      s0 = Symbol('foo');
      obj[s0] = 2;
      expect(enumOwnProps(obj)).to.have.members(['a', s0]);
    }
  });

  it('Should not get props of prototype', function() {
    var s0, s1, s2;
    if (typeof Symbol === 'function') {
      s0 = Symbol('foo');
      s1 = Symbol('bar');
      s2 = Symbol('baz');
    }

    function Fn0() {}
    Fn0.prototype.a = 1;
    if (typeof Symbol === 'function') {
      Fn0.prototype[s0] = 2;
    }
    expect(enumOwnProps(new Fn0())).to.have.members([]);

    function Fn1() {
      this.b = true;
      if (typeof Symbol === 'function') {
        this[s1] = false;
      }
    }
    Fn1.prototype = new Fn0();
    Fn1.prototype.d = 'D';
    if (typeof Symbol === 'function') {
      Fn1.prototype[s2] = 'S2';
      expect(enumOwnProps(new Fn1())).to.have.members(['b', s1]);
    } else {
      expect(enumOwnProps(new Fn1())).to.have.members(['b']);
    }
  });

  it('Should get only enumerable props', function() {
    var s0, s1;
    if (typeof Symbol === 'function') {
      s0 = Symbol('foo');
      s1 = Symbol('bar');
    }

    var obj = {};
    Object.defineProperty(obj, 'a', { enumerable: true, value: 1 });
    Object.defineProperty(obj, 'b', { value: 2 });
    if (typeof Symbol === 'function') {
      Object.defineProperty(obj, s0, { enumerable: true, value: 3 });
      Object.defineProperty(obj, s1, { value: 4 });
      expect(enumOwnProps(obj)).to.have.members(['a', s0]);
    } else {
      expect(enumOwnProps(obj)).to.have.members(['a']);
    }
  });

  it('Should return an empty array when arg is nullish', function() {
    expect(enumOwnProps(undefined)).to.have.members([]);
    expect(enumOwnProps(null)).to.have.members([]);
  });

  it('Should return an empty array when arg is primitive type',
  function() {
    expect(enumOwnProps(true)).to.have.members([]);
    expect(enumOwnProps(false)).to.have.members([]);
    expect(enumOwnProps(0)).to.have.members([]);
    expect(enumOwnProps(123)).to.have.members([]);
  });

  it('Should return an array having index strings as keys when arg is' +
  '\n\ta string', function() {
    expect(enumOwnProps('')).to.have.members([]);
    expect(enumOwnProps('abc')).to.have.members(['0', '1', '2']);

    var s = 'abc';
    try {
      s.aaa = 'AAA';
    } catch (e) {
      // Throw TypeError on Node.js version 0.11 or later.
      //console.error('\t', e.message);
    }
    expect(enumOwnProps(s)).to.have.members(['0', '1', '2']);

    try {
      Object.defineProperty(s, 'bbb', { value: 'BBB' });
    } catch (e) {
      // Throw TypeError on Node.js version 0.11 or later.
      //console.error('\t', e.message);
    }
    expect(enumOwnProps(s)).to.have.members(['0', '1', '2']);
  });

  it('Should return an array of index strings as keys when arg is' +
  '\n\ta String object', function() {
    var s = new String('abc');
    expect(enumOwnProps(s)).to.have.members(['0', '1', '2']);

    var symbol1, symbol2;
    if (typeof Symbol === 'function') {
      symbol1 = Symbol('foo');
      symbol2 = Symbol('bar');
    }

    s.aaa = 'AAA';
    if (typeof Symbol === 'function') {
      s[symbol1] = 'S1';
      expect(enumOwnProps(s)).to.have.members(['0', '1', '2', 'aaa', symbol1]);
    } else {
      expect(enumOwnProps(s)).to.have.members(['0', '1', '2', 'aaa']);
    }

    Object.defineProperty(s, 'bbb', { value: 'BBB' });
    if (typeof Symbol === 'function') {
      Object.defineProperty(s, symbol2, { value: 'S2' });
      expect(enumOwnProps(s)).to.have.members(['0', '1', '2', 'aaa', symbol1]);
    } else {
      expect(enumOwnProps(s)).to.have.members(['0', '1', '2', 'aaa']);
    }
  });

  it('Should return an array of index strings as keys when arg is' +
  '\n\ta array', function() {
    expect(enumOwnProps([])).to.have.members([]);
    expect(enumOwnProps([1, 2, 3])).to.have.members(['0', '1', '2']);

    var sym0, sym1;
    if (typeof Symbol === 'function') {
      sym0 = Symbol('sym0');
      sym1 = Symbol('sym1');
    }

    var a = ['a', 'b'];
    a.aaa = 'AAA';
    if (typeof Symbol === 'function') {
      a[sym0] = 'SYM0';
      expect(enumOwnProps(a)).to.have.members(['0', '1', 'aaa', sym0]);
    } else {
      expect(enumOwnProps(a)).to.have.members(['0', '1', 'aaa']);
    }

    Object.defineProperty(a, 'bbb', { value: 'BBB' });
    if (typeof Symbol === 'function') {
      Object.defineProperty(a, sym1, { value: 'SYM2' });
      expect(enumOwnProps(a)).to.have.members(['0', '1', 'aaa', sym0]);
    } else {
      expect(enumOwnProps(a)).to.have.members(['0', '1', 'aaa']);
    }
  });

  it('Should return appended props when arg is a function', function() {
    var fn = function() {};
    expect(enumOwnProps(fn)).to.have.members([]);

    var sym0, sym1;
    if (typeof Symbol === 'function') {
      sym0 = Symbol('foo');
      sym1 = Symbol('bar');
    }

    fn.aaa = 'AAA';
    if (typeof Symbol === 'function') {
      fn[sym0] = 'S0';
      expect(enumOwnProps(fn)).to.have.members(['aaa', sym0]);
    } else {
      expect(enumOwnProps(fn)).to.have.members(['aaa']);
    }

    Object.defineProperty(fn, 'bbb', { value: 'BBB' });
    if (typeof Symbol === 'function') {
      Object.defineProperty(fn, sym1, { value: 'S1' });
      expect(enumOwnProps(fn)).to.have.members(['aaa', sym0]);
    } else {
      expect(enumOwnProps(fn)).to.have.members(['aaa']);
    }
  });

});
