'use strict';

var chai = require('chai');
var expect = chai.expect;

var fav = {}; fav.prop = require('..');

var defaults = fav.prop.defaults;

describe('fav.prop.defaults', function() {

  it('Should return an empty plain object if arg is nullish', function() {
    expect(defaults(undefined)).to.deep.equal({});
    expect(defaults(null)).to.deep.equal({});
    expect(defaults(undefined, undefined)).to.deep.equal({});
    expect(defaults(null, null)).to.deep.equal({});
    expect(defaults({}, undefined)).to.deep.equal({});
    expect(defaults({}, null)).to.deep.equal({});
    expect(defaults(undefined, {})).to.deep.equal({});
    expect(defaults(null, {})).to.deep.equal({});
  });

  it('Should copy prop keys from a source object to a destination object',
  function() {
    var date = new Date();
    var o0 = {};
    var o1 = { a: 1, b: true, c: 'C', d: date };
    var ret = defaults(o0, o1);
    expect(ret).to.equal(o0);
    expect(ret).to.not.equal(o1);
    expect(ret).to.deep.equal(o1);
  });

  it('Should copy prop symbols from a source object to a destination ' +
  'object', function() {
    if (typeof Symbol !== 'function') {
      this.skip();
      return;
    }

    var symA = Symbol('a');
    var symB = Symbol('a');
    var symC = Symbol('a');

    var date = new Date();
    var o0 = {};

    var o1 = {};
    o1[symA] = 1;
    o1[symB] = true;
    o1[symC] = date;

    var ret = defaults(o0, o1);
    expect(ret).to.equal(o0);
    expect(ret).to.not.equal(o1);
    expect(ret).to.deep.equal({});
    expect(Object.getOwnPropertySymbols(ret)).to.deep.equal(
      Object.getOwnPropertySymbols(o1));
    expect(ret[symA]).to.equal(1);
    expect(ret[symB]).to.equal(true);
    expect(ret[symC]).to.equal(date);
  });

  it('Should copy prop keys from source objects to a destination object',
  function() {
    var o1 = { a: 1 };
    var o2 = { b: 2 };
    var o3 = { c: 3 };
    var ret = defaults(o1, o2, o3);
    expect(ret).to.equal(o1);
    expect(ret).to.deep.equal({ a: 1, b: 2, c: 3 });
  });

  it('Should copy property symbols from source objects to a destination ' +
  'object', function() {
    if (typeof Symbol !== 'function') {
      this.skip();
      return;
    }

    var symA = Symbol('a');
    var symB = Symbol('b');
    var symC = Symbol('c');

    var o1 = {}, o2 = {}, o3 = {};
    o1[symA] = 1;
    o2[symB] = 2;
    o3[symC] = 3;
    var ret = defaults(o1, o2, o3);
    expect(ret).to.equal(o1);
    expect(ret).to.deep.equal({});
    expect(Object.getOwnPropertySymbols(ret)).to.deep.equal(
      [symA, symB, symC]);
    expect(ret[symA]).to.equal(1);
    expect(ret[symB]).to.equal(2);
    expect(ret[symC]).to.equal(3);
  });

  it('Should copy only enumerable prop keys', function() {
    var o1 = {};
    var o2 = {};
    var o3 = {};

    Object.defineProperties(o1, {
      'a1': { enumerable: true, value: 11 },
      'b1': { value: 12 },
    });

    Object.defineProperties(o2, {
      'a2': { enumerable: true, value: 21 },
      'b2': { value: 22 },
    });

    Object.defineProperties(o3, {
      'a3': { enumerable: true, value: 31 },
      'b3': { value: 32 },
    });

    var ret = defaults(o1, o2, o3);
    expect(ret).to.equal(o1);
    expect(ret).to.deep.equal({ a1: 11, a2: 21, a3: 31 });
    expect(ret.b1).to.equal(12);
    expect('b2' in ret).to.be.false;
    expect('b3' in ret).to.be.false;
  });

  it('Should copy only enumerable property symbols', function() {
    if (typeof Symbol !== 'function') {
      this.skip();
      return;
    }

    var symA1 = Symbol('symA1');
    var symA2 = Symbol('symA2');
    var symA3 = Symbol('symA3');
    var symB1 = Symbol('symB1');
    var symB2 = Symbol('symB2');
    var symB3 = Symbol('symB3');

    var o1 = {};
    var o2 = {};
    var o3 = {};

    Object.defineProperty(o1, symA1, { enumerable: true, value: 11 });
    Object.defineProperty(o1, symB1, { value: 12 });

    Object.defineProperty(o2, symA2, { enumerable: true, value: 21 });
    Object.defineProperty(o2, symB2, { value: 22 });

    Object.defineProperty(o3, symA3, { enumerable: true, value: 31 });
    Object.defineProperty(o2, symB3, { value: 32 });

    var ret = defaults(o1, o2, o3);
    expect(ret).to.equal(o1);
    expect(ret).to.deep.equal({});

    expect(Object.getOwnPropertySymbols(ret)).to.have.members(
      [symA1, symB1, symA2, symA3]);

    expect(ret[symA1]).to.equal(11);
    expect(ret[symB1]).to.equal(12);
    expect(ret[symA2]).to.equal(21);
    expect(ret[symA3]).to.equal(31);
  });

  it('Should copy only own prop keys', function() {
    var Fn0 = function() {
      this.a0 = 1;
      this.b0 = 2;
    };
    var Fn1 = function() {
      this.a1 = 11;
      this.b1 = 12;
    };
    var Fn2 = function() {
      this.a2 = 21;
      this.b2 = 22;
    };
    Fn1.prototype = new Fn2();
    Fn0.prototype = new Fn1();
    var fn0 = new Fn0();

    var ret = defaults({}, fn0);
    expect(ret).to.deep.equal({ a0: 1, b0: 2 });
    expect('a1' in ret).to.be.false;
    expect('b1' in ret).to.be.false;
    expect('a2' in ret).to.be.false;
    expect('b2' in ret).to.be.false;
  });

  it('Should copy only own property symbols', function() {
    if (typeof Symbol !== 'function') {
      this.skip();
      return;
    }

    var a0 = Symbol('a0');
    var a1 = Symbol('a1');
    var a2 = Symbol('a2');
    var b0 = Symbol('b0');
    var b1 = Symbol('b1');
    var b2 = Symbol('b2');

    var Fn0 = function() {
      this[a0] = 1;
      this[b0] = 2;
    };
    var Fn1 = function() {
      this[a1] = 11;
      this[b1] = 12;
    };
    var Fn2 = function() {
      this[a2] = 21;
      this[b2] = 22;
    };
    Fn1.prototype = new Fn2();
    Fn0.prototype = new Fn1();
    var fn0 = new Fn0();

    var ret = defaults({}, fn0);
    expect(ret).to.deep.equal({});
    expect(Object.getOwnPropertySymbols(ret)).to.have.members([a0, b0]);
    expect(ret[a0]).to.equal(1);
    expect(ret[b0]).to.equal(2);
  });

  it('Should copy only non-nullish prop keys of source objects', function() {
    var arr = [1, 2, 3];
    var fn = function() {};

    var o1 = { a: true, b: 0, c: '', d: null, e: undefined, f: fn, g: arr };
    var ret = defaults({}, o1);

    expect(ret).to.deep.equal({ a: true, b: 0, c: '', f: fn, g: arr });
    expect('d' in ret).to.be.false;
    expect('e' in ret).to.be.false;
  });

  it('Should copy only non-nullish property symbols of source objects',
  function() {
    if (typeof Symbol !== 'function') {
      this.skip();
      return;
    }

    var a = Symbol('a');
    var b = Symbol('b');
    var c = Symbol('c');
    var d = Symbol('d');
    var e = Symbol('e');
    var f = Symbol('f');
    var g = Symbol('g');

    var arr = [1, 2, 3];
    var fn = function() {};

    var o1 = {};
    o1[a] = true;
    o1[b] = 0;
    o1[c] = '';
    o1[d] = null;
    o1[e] = undefined;
    o1[f] = fn;
    o1[g] = arr;

    var ret = defaults({}, o1);

    expect(ret).to.deep.equal({});
    expect(Object.getOwnPropertySymbols(ret)).to.have.members([a, b, c, f, g]);
    expect(ret[a]).to.equal(true);
    expect(ret[b]).to.equal(0);
    expect(ret[c]).to.equal('');
    expect(ret[f]).to.equal(fn);
    expect(ret[g]).to.equal(arr);
  });

  it('Should copy only undefined or null prop keys of a destination object',
  function() {
    var arr = [1, 2, 3];
    var fn = function() {};

    var o0 = { a: true, b: 0, c: '', d: null, e: undefined, f: fn, g: arr };
    var o1 = { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8 };
    var ret = defaults(o0, o1);

    expect(ret).to.deep.equal(
      { a: true, b: 0, c: '', d: 4, e: 5, f: fn, g: arr, h: 8 });
  });

  it('Should copy not deeply but shallowly', function() {
    var o1 = { a: 0, b: { c: 'C', d: { e: 'E' } } };
    var ret = defaults({}, o1);

    expect(ret).to.not.equal(o1);
    expect(ret).to.deep.equal(o1);
    expect(ret.b).to.equal(o1.b);
  });

  it('Should not throw Error when destination properties are read only',
  function() {
    var o0 = {};
    Object.defineProperties(o0, {
      a: { enumerable: true, value: null },
      b: { enumerable: true, value: undefined },
      c: { enumerable: true, writable: true, value: null },
      d: { enumerable: true, writable: true, value: undefined },
    });
    var o1 = { a: 1, b: 2, c: 3, d: 4, e: 5 };
    var ret = defaults(o0, o1);
    expect(ret).to.equal(o0);
    expect(ret).to.deep.equal({ a: null, b: undefined, c: 3, d: 4, e: 5 });
    expect('b' in ret).to.be.true;
  });

});

