'use strict';

var chai = require('chai');
var expect = chai.expect;

var fav = {}; fav.prop = require('..');

var listOwnSymbols = fav.prop.listOwnSymbols;

describe('fav.prop.listOwnSymbols', function() {

  it('Should get all own prop symbols when arg is a plain object', function() {
    if (typeof Symbol !== 'function') {
      this.skip();
      return;
    }

    var s0 = Symbol('foo');
    var s1 = Symbol('bar');
    var s2 = Symbol('baz');
    var o0 = {};
    o0[s0] = 's0';
    o0[s1] = 's1';
    o0[s2] = 's2';

    var ret = listOwnSymbols(o0);
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
    expect(listOwnSymbols(new Fn0())).to.have.members([]);

    function Fn1() {
      this[b] = true;
      this[c] = 'C';
    }
    Fn1.prototype = new Fn0();
    Fn1.prototype[d] = 'D';
    expect(listOwnSymbols(new Fn1())).to.have.members([b, c]);
  });

  it('Should get enumerable and unenumerable property symbols', function() {
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
    expect(listOwnSymbols(obj)).to.have.members([a, b, c]);
  });

  it('Should return an empty array when the argument is nullish', function() {
    expect(listOwnSymbols(undefined)).to.have.members([]);
    expect(listOwnSymbols(null)).to.have.members([]);
  });

  it('Should return an empty array when the argument is primitive type',
  function() {
    expect(listOwnSymbols(true)).to.have.members([]);
    expect(listOwnSymbols(false)).to.have.members([]);
    expect(listOwnSymbols(0)).to.have.members([]);
    expect(listOwnSymbols(123)).to.have.members([]);
    expect(listOwnSymbols('')).to.have.members([]);
    expect(listOwnSymbols('abc')).to.have.members([]);
  });

  it('Should return appended prop symbols when arg is a non-plan object',
  function() {
    if (typeof Symbol !== 'function') {
      this.skip();
      return;
    }

    var s0 = Symbol('s0');
    var s1 = Symbol('s1');

    var str = new String('abc');
    str.a = 1;
    str[s0] = 'S0';
    Object.defineProperty(str, s1, { value: 'S1' });
    expect(listOwnSymbols(str)).to.have.members([s0, s1]);

    var arr = [1, 2, 3];
    arr.a = 1;
    arr[s0] = 'S0';
    Object.defineProperty(arr, s1, { value: 'S1' });
    expect(listOwnSymbols(arr)).to.have.members([s0, s1]);

    var fn = function() {};
    fn.a = 1;
    fn[s0] = 'S0';
    Object.defineProperty(fn, s1, { value: 'S1' });
    expect(listOwnSymbols(fn)).to.have.members([s0, s1]);
  });

  it('Should not get normal property keys', function() {
    var o0 = { a: 1, b: 2, c: 3 };
    var ret = listOwnSymbols(o0);
    expect(ret).to.have.members([]);
  });
});
