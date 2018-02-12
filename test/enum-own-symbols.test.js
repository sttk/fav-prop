'use strict';

var chai = require('chai');
var expect = chai.expect;

var fav = {}; fav.prop = require('..');

var enumOwnSymbols = fav.prop.enumOwnSymbols;

describe('fav.prop.enumOwnSymbols', function() {

  it('Should get all property symbols when the argument is a plain object',
  function() {
    if (typeof Symbol !== 'function') {
      this.skip();
      return;
    }

    var s0 = Symbol('foo');
    var s1 = Symbol('bar');
    var s2 = Symbol('baz');
    var o0 = {};
    o0[s0] = 'S0';
    o0[s1] = 'S1';
    o0[s2] = 'S2';

    var ret = enumOwnSymbols(o0);
    expect(ret).to.have.members([s0, s1, s2]);
  });

  it('Should not get property symbols of prototype', function() {
    if (typeof Symbol !== 'function') {
      this.skip();
      return;
    }

    var a = Symbol('a');
    var b = Symbol('b');
    var c = Symbol('c');
    var d = Symbol('d');

    function Fn0() {}
    Fn0.prototype[a] = 1;
    expect(enumOwnSymbols(new Fn0())).to.have.members([]);

    function Fn1() {
      this[b] = true;
      this[c] = 'C';
    }
    Fn1.prototype = new Fn0();
    Fn1.prototype[d] = 'D';
    expect(enumOwnSymbols(new Fn1())).to.have.members([b, c]);
  });

  it('Should get only enumerable property symbols', function() {
    if (typeof Symbol !== 'function') {
      this.skip();
      return;
    }

    var a = Symbol('A');
    var b = Symbol('B');
    var c = Symbol('C');

    var obj = {};
    Object.defineProperty(obj, a, { enumerable: true, value: 1 });
    Object.defineProperty(obj, b, { value: true });
    Object.defineProperty(obj, c, { value: 'C' });
    expect(enumOwnSymbols(obj)).to.have.members([a]);
  });

  it('Should return an empty array when the argument is nullish', function() {
    expect(enumOwnSymbols(undefined)).to.have.members([]);
    expect(enumOwnSymbols(null)).to.have.members([]);
  });

  it('Should return an empty array when the argument is primitive type',
  function() {
    expect(enumOwnSymbols(true)).to.have.members([]);
    expect(enumOwnSymbols(false)).to.have.members([]);
    expect(enumOwnSymbols(0)).to.have.members([]);
    expect(enumOwnSymbols(123)).to.have.members([]);
    expect(enumOwnSymbols('')).to.have.members([]);
    expect(enumOwnSymbols('abc')).to.have.members([]);
  });

  it('Should return appended property symbols when the argument is a non ' +
  '\n\tplain object', function() {
    if (typeof Symbol !== 'function') {
      this.skip();
      return;
    }

    var s0 = Symbol('s0');
    var s1 = Symbol('s2');

    var str = new String('abc');
    str.a = 1;
    str[s0] = 'S0';
    Object.defineProperty(str, s1, { value: 'S1' });
    expect(enumOwnSymbols(str)).to.have.members([s0]);

    var arr = [1, 2, 3];
    arr.a = 1;
    arr[s0] ='S0';
    Object.defineProperty(arr, s1, { value: 'S1' });
    expect(enumOwnSymbols(arr)).to.have.members([s0]);

    var fn = function() {};
    fn.a = 1;
    fn[s0] = 'S0';
    Object.defineProperty(fn, s1, { value: 'S1' });
    expect(enumOwnSymbols(fn)).to.have.members([s0]);
  });

  it('Should not get normal property keys', function() {
    var o0 = { a: 1, b: 2, c: 3 };
    var ret = enumOwnSymbols(o0);
    expect(ret).to.have.members([]);
  });
});
