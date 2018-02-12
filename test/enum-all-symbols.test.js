'use strict';

var chai = require('chai');
var expect = chai.expect;

var fav = {}; fav.prop = require('..');

var enumAllSymbols = fav.prop.enumAllSymbols;

describe('fav.prop.enumAllSymbols', function() {

  it('Should get all property symbols when the argument is a plain object',
  function() {
    if (typeof Symbol !== 'function') {
      this.skip();
      return;
    }

    var s0 = Symbol('foo');
    var s1 = Symbol('bar');
    var s2 = Symbol('baz');
    var obj = {};
    obj[s0] = 0;
    obj[s1] = 1;
    obj[s2] = 2;

    var ret = enumAllSymbols(obj);
    expect(ret).to.have.members([s0, s1, s2]);
  });

  it('Should get property symbols of prototype', function() {
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
    expect(enumAllSymbols(new Fn0())).to.have.members([a]);

    function Fn1() {
      this[b] = true;
      this[c] = 'C';
    }
    Fn1.prototype = new Fn0();
    Fn1.prototype[d] = 'D';
    expect(enumAllSymbols(new Fn1())).to.have.members([a, b, c, d]);
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
    expect(enumAllSymbols(obj)).to.have.members([a]);
  });

  it('Should return an empty array when the argument is nullish', function() {
    expect(enumAllSymbols(undefined)).to.have.members([]);
    expect(enumAllSymbols(null)).to.have.members([]);
  });

  it('Should return an empty array when the argumetn is primitive type',
  function() {
    expect(enumAllSymbols(true)).to.have.members([]);
    expect(enumAllSymbols(false)).to.have.members([]);
    expect(enumAllSymbols(0)).to.have.members([]);
    expect(enumAllSymbols(123)).to.have.members([]);
    expect(enumAllSymbols('')).to.have.members([]);
    expect(enumAllSymbols('abc')).to.have.members([]);
  });

  it('Should return appended property symbols when the argument is a non ' +
  '\n\tplain object', function() {
    if (typeof Symbol !== 'function') {
      this.skip();
      return;
    }

    var a = Symbol('A');

    var arr = [];
    expect(enumAllSymbols(arr)).to.have.members([]);

    arr = arr.concat([1, 2, 3]);
    expect(enumAllSymbols(arr)).to.have.members([]);

    arr[a] = 123;
    expect(enumAllSymbols(arr)).to.have.members([a]);

    var fn = function() {};
    expect(enumAllSymbols(fn)).to.have.members([]);

    fn[a] = 123;
    expect(enumAllSymbols(fn)).to.have.members([a]);
  });

  it('Should not get normal property keys', function() {
    var obj = { a: 1, b: 2, c: 3 };
    var ret = enumAllSymbols(obj);
    expect(ret).to.have.members([]);
  });
});
