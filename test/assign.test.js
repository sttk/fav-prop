'use strict';

var chai = require('chai');
var expect = chai.expect;

var fav = {}; fav.prop = require('..');

var assign = fav.prop.assign;

describe('fav.prop.assign', function() {

  it('Should return an empty plain object if arg is nullish', function() {
    expect(assign(undefined)).to.deep.equal({});
    expect(assign(null)).to.deep.equal({});
    expect(assign(undefined, undefined)).to.deep.equal({});
    expect(assign(null, null)).to.deep.equal({});
    expect(assign({}, undefined)).to.deep.equal({});
    expect(assign({}, null)).to.deep.equal({});
    expect(assign(undefined, {})).to.deep.equal({});
    expect(assign(null, {})).to.deep.equal({});
  });

  it('Should return `dest` object which is assigned props of `src`',
  function() {
    var dest = {};
    var src = { a: 0, b: { c: 0 } };
    var ret = assign(dest, src);
    expect(ret).to.equal(dest);
    expect(ret).to.not.equal(src);
    expect(ret).to.deep.equal(src);
    expect(dest).to.not.equal(src);
    expect(ret.a).to.equal(src.a);
    expect(ret.b).to.equal(src.b);
    expect(ret.b.c).to.equal(src.b.c);
  });

  it('Should merge objects', function() {
    var o1 = { a: 1 };
    var o2 = { b: 2 };
    var o3 = { c: 3 };
    var ret = assign(o1, o2, o3);
    expect(ret).to.equal(o1);
    expect(ret).to.deep.equal({ a: 1, b: 2, c: 3 });
  });

  it('Should merge objects with same properties', function() {
    var o0 = {};
    var o1 = { a: 1, b: 1, c: 1 };
    var o2 = { b: 2, c: 2 };
    var o3 = { c: 3 };
    var ret = assign(o0, o1, o2, o3);
    expect(ret).to.equal(o0);
    expect(ret).to.deep.equal({ a: 1, b: 2, c: 3 });
  });

  it('Should not copy unenumerable properties', function() {
    var obj = Object.create({ foo: 1 }, {
      bar: { value: 2 },
      baz: { value: 3, enumerable: true },
    });

    var copy = assign({}, obj);
    expect(copy).to.deep.equal({ baz: 3 });
    expect(copy.bar).to.be.undefined;
  });

  it('Should not copy inherited properties', function() {
    function Fn0() {
      this.a0 = 0;
      this.b0 = 'b';
    };
    function Fn1() {
      this.a1 = 1;
      this.b1 = 'B';
    };
    Fn1.prototype = new Fn0();

    var fn1 = new Fn1();
    var ret = assign({}, fn1);
    expect(ret).to.deep.equal({ a1: 1, b1: 'B' });
    expect(ret.a0).to.be.undefined;
    expect(ret.b0).to.be.undefined;
  });

  it('Should copy symbol-typed properties', function() {
    if (typeof Symbol !== 'function') {
      this.skip();
      return;
    }

    var o0 = {};
    var o1 = { a: 1 };
    var o2 = {};
    o2[Symbol('foo')] = 2;

    var ret = assign(o0, o1, o2);
    expect(ret).to.equal(o0);
    expect(ret).to.deep.equal({ a: 1 });

    var prop0 = Object.getOwnPropertySymbols(ret);
    var prop2 = Object.getOwnPropertySymbols(o2);
    expect(prop0).to.have.members(prop2);
  });

  it('Should not copy unenumerable symbol-typed properties', function() {
    if (typeof Symbol !== 'function') {
      this.skip();
      return;
    }

    var symbol0 = Symbol('s-0');
    var symbol1 = Symbol('s-1');

    var src = {};
    src[symbol0] = 'a';
    Object.defineProperty(src, symbol1, { value: 'b' });

    var dest = assign({}, src);
    expect(dest).to.deep.equal({});
    expect(Object.getOwnPropertySymbols(dest)).to.deep.equal([symbol0]);
    expect(dest[symbol0]).to.equal('a');
    expect(dest[symbol1]).to.equal(undefined);
  });

  it('Should not copy inherited symbol-typed properties', function() {
    if (typeof Symbol !== 'function') {
      this.skip();
      return;
    }

    var symbol0 = Symbol('s-0');
    var symbol1 = Symbol('s-1');

    var Fn0 = function() {
      this[symbol0] = 'a';
    };
    var Fn1 = function() {
      this[symbol1] = 'b';
    };
    Fn0.prototype = new Fn1();
    var src = new Fn0();
    expect(src[symbol0]).to.equal('a');
    expect(src[symbol1]).to.equal('b');

    var dest = assign({}, src);
    expect(dest).to.deep.equal({});
    expect(Object.getOwnPropertySymbols(dest)).to.deep.equal([symbol0]);
    expect(dest[symbol0]).to.equal('a');
    expect(dest[symbol1]).to.equal(undefined);
  });

  it('Should wrap primitives to objects', function() {
    var dest = {};
    var v1 = 'abc';
    var v2 = true;
    var v3 = 10;
    expect(assign(dest, v1, null, v2, undefined, v3)).to.deep.equal(
      { 0: 'a', 1: 'b', 2: 'c' });
  });

  it('Should not throw Errors when destination properties are read only',
  function() {
    var o0 = Object.defineProperties({}, {
      foo: { enumerable: true, value: 0 },
      bar: { enumerable: true, writable: true, value: 1 },
    });

    var symbol1, symbol2;
    if (typeof Symbol === 'function') {
      symbol1 = Symbol('s1');
      symbol2 = Symbol('s2');

      Object.defineProperty(o0, symbol1, {
        enumerable: true,
        value: 3,
      });
      Object.defineProperty(o0, symbol2, {
        enumerable: true,
        writable: true,
        value: 4,
      });
    }

    var o1 = { foo: 10 };
    var o2 = { bar: 20 };

    if (typeof Symbol === 'function') {
      o2[symbol1] = 30;
      o2[symbol2] = 40;
    }

    var ret = assign(o0, o1, o2);
    expect(ret).to.deep.equal({ foo: 0, bar: 20 });

    if (typeof Symbol === 'function') {
      expect(ret[symbol1]).to.equal(3);
      expect(ret[symbol2]).to.equal(40);
    }
  });

});
