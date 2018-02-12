'use strict';

var chai = require('chai');
var expect = chai.expect;

var fav = {}; fav.prop = require('..');

var defaultsDeep = fav.prop.defaultsDeep;

describe('fav.prop.defaultsDeep', function() {

  it('Should return an empty plain object if arg is nullish', function() {
    expect(defaultsDeep(undefined)).to.deep.equal({});
    expect(defaultsDeep(null)).to.deep.equal({});
    expect(defaultsDeep(undefined, undefined)).to.deep.equal({});
    expect(defaultsDeep(null, null)).to.deep.equal({});
    expect(defaultsDeep({}, undefined)).to.deep.equal({});
    expect(defaultsDeep({}, null)).to.deep.equal({});
    expect(defaultsDeep(undefined, {})).to.deep.equal({});
    expect(defaultsDeep(null, {})).to.deep.equal({});
  });

  it('Should copy prop keys of a plain object to a destination object deeply',
  function() {
    var dest = {};
    var src = { a: 0, b: { c: 0 } };
    var ret = defaultsDeep(dest, src);
    expect(ret).to.equal(dest);
    expect(ret).to.not.equal(src);
    expect(ret).to.deep.equal(src);
    expect(ret.a).to.equal(src.a);
    expect(ret.b).to.not.equal(src.b);
    expect(ret.b).to.deep.equal(src.b);
    expect(ret.b.c).to.equal(src.b.c);
  });

  it('Should copy prop symbols of a plain object to a destination object ' +
  '\n\tdeeply', function() {
    if (typeof Symbol !== 'function') {
      this.skip();
      return;
    }
    var a = Symbol('a');
    var b = Symbol('b');
    var c = Symbol('c');

    var dest = {};
    var src = {};
    src[a] =  0;
    src[b] = {};
    src[b][c] = 0;
    var ret = defaultsDeep(dest, src);
    expect(ret).to.equal(dest);
    expect(ret).to.not.equal(src);
    expect(ret).to.deep.equal(src);
    expect(ret[a]).to.equal(src[a]);
    expect(ret[b]).to.not.equal(src[b]);
    expect(ret[b]).to.deep.equal(src[b]);
    expect(ret[b][c]).to.equal(src[b][c]);
  });

  it('Should not copy prop keys of a plain object when destination props are' +
  '\n\tnot nullish', function() {
    var dest = { a: 10, c: { d: 30 }, f: 50 };
    var src = { a: 1, b: 2, c: { d: 3, e: 4 }, f: { g: 5 } };
    var ret = defaultsDeep(dest, src);
    expect(ret).to.equal(dest);
    expect(ret).to.not.equal(src);
    expect(ret).to.not.deep.equal(src);
    expect(ret).to.deep.equal({ a: 10, b: 2, c: { d: 30, e: 4 }, f: 50 });
  });

  it('Should not copy prop symbols of a plain object when destination props' +
  '\n\tare not nullish', function() {
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

    var dest = {};
    dest[a] = 10;
    dest[c] = {};
    dest[c][d] = 30;
    dest[f] = 50;
    var src = {};
    src[a] = 1;
    src[b] = 2;
    src[c] = {};
    src[c][d] = 3;
    src[c][e] = 4;
    src[f] = {};
    src[f][g] = 5;
    var ret = defaultsDeep(dest, src);
    expect(ret).to.equal(dest);
    expect(ret).to.not.equal(src);

    expect(ret[a]).to.equal(10);
    expect(ret[b]).to.equal(2);
    expect(ret[c][d]).to.equal(30);
    expect(ret[c][e]).to.equal(4);
    expect(ret[f]).to.equal(50);
  });

  it('Should merge nullish prop keys of objects deeply', function() {
    var o1 = { a: { b: { c: 'c1', d: 'd1' } } };
    var o2 = { a: { b: { c: 'c2', e: 'e2' } } };
    var o3 = { a: { b: { c: 'c3', f: { g: 'g3' } } } };
    var ret = defaultsDeep(o1, o2, o3);
    expect(ret).to.equal(o1);
    expect(ret).to.deep.equal({
      a: { b: { c: 'c1', d: 'd1', e: 'e2', f: { g: 'g3' } } }
    });
    expect(o2).to.deep.equal({ a: { b: { c: 'c2', e: 'e2' } } });
    expect(o3).to.deep.equal({ a: { b: { c: 'c3', f: { g: 'g3' } } } });
  });

  it('Should merge nullish prop symbols of objects deeply', function() {
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

    var o1 = {};
    o1[a] = {};
    o1[a][b] = {};
    o1[a][b][c] = 'c1';
    o1[a][b][d] = 'd1';
    var o2 = {};
    o2[a] = {};
    o2[a][b] = {};
    o2[a][b][c] = 'c2';
    o2[a][b][e] = 'e2';
    var o3 = {};
    o3[a] = {};
    o3[a][b] = {};
    o3[a][b][c] = 'c3';
    o3[a][b][f] = {};
    o3[a][b][f][g] = 'g3';
    var ret = defaultsDeep(o1, o2, o3);
    expect(ret).to.equal(o1);
    expect(ret[a][b][c]).to.equal('c1');
    expect(ret[a][b][d]).to.equal('d1');
    expect(ret[a][b][e]).to.equal('e2');
    expect(ret[a][b][f][g]).to.equal('g3');
  });

  it('Should not copy unenumerable prop keys', function() {
    var obj = { a: 1 };
    Object.defineProperties(obj, {
      b: { value: 2 },
      c: { enumerable: true, value: {} },
    });
    Object.defineProperties(obj.c, {
      d: { value: 3 },
      e: { enumerable: true, value: 4 },
    });

    var ret = defaultsDeep({}, obj);
    expect(ret).to.deep.equal({ a: 1, c: { e: 4 } });
    expect(ret.b).to.be.undefined;
    expect(ret.c.d).to.be.undefined;
  });

  it('Should not copy unenumerable prop symbols', function() {
    if (typeof Symbol !== 'function') {
      this.skip();
      return;
    }
    var a = Symbol('a');
    var b = Symbol('b');
    var c = Symbol('c');
    var d = Symbol('d');
    var e = Symbol('e');

    var obj = {};
    obj[a] = 1;

    Object.defineProperty(obj, b, { value: 2 });
    Object.defineProperty(obj, c, { enumerable: true, value: {} });
    Object.defineProperty(obj[c], d, { value: 3 });
    Object.defineProperty(obj[c], e, { enumerable: true, value: 4 });

    var ret = defaultsDeep({}, obj);
    expect(ret[a]).to.equal(1);
    expect(ret[c][e]).to.equal(4);
    expect(ret[b]).to.be.undefined;
    expect(ret[c][d]).to.be.undefined;
  });

  it('Should not copy inherited prop keys', function() {
    function Fn0() {
      this.a0 = 0;
      this.b0 = { c0: 'C0', d0: { e0: 'E0' } };
    }
    function Fn1() {
      this.a1 = 1;
      this.b1 = { c1: 'C1', d1: { e1: 'E1' } };
    }
    Fn1.protoype = new Fn0();

    var fn1 = new Fn1();
    var ret = defaultsDeep({}, fn1);
    expect(ret).to.deep.equal({ a1: 1, b1: { c1: 'C1', d1: { e1: 'E1' } } });
  });

  it('Should not copy inherited prop symbols', function() {
    if (typeof Symbol !== 'function') {
      this.skip();
      return;
    }
    var a0 = Symbol('a');
    var b0 = Symbol('b');
    var c0 = Symbol('c');
    var d0 = Symbol('d');
    var e0 = Symbol('e');
    var a1 = Symbol('a');
    var b1 = Symbol('b');
    var c1 = Symbol('c');
    var d1 = Symbol('d');
    var e1 = Symbol('e');

    function Fn0() {
      this[a0] = 0;
      this[b0] = {};
      this[b0][c0] = 'C0';
      this[b0][d0] = {};
      this[b0][d0][e0] = 'E0';
    }
    function Fn1() {
      this[a1] = 1;
      this[b1] = {};
      this[b1][c1] = 'C1';
      this[b1][d1] = {};
      this[b1][d1][e1] = 'E1';
    }
    Fn1.protoype = new Fn0();

    var fn1 = new Fn1();
    var ret = defaultsDeep({}, fn1);
    expect(ret[a0]).to.be.undefined;
    expect(ret[a1]).to.equal(1);
    expect(ret[b0]).to.be.undefined;
    expect(ret[b1][c1]).to.equal('C1');
    expect(ret[b1][d1][e1]).to.equal('E1');
  });

  it('Should replace first argument which is not a plain object to a plain' +
  '\n\tobject', function() {
    var o1 = { a: 1 };
    expect(defaultsDeep(true, o1)).to.not.equal(o1);
    expect(defaultsDeep(true, o1)).to.deep.equal(o1);
    expect(defaultsDeep(false, o1)).to.not.equal(o1);
    expect(defaultsDeep(false, o1)).to.deep.equal(o1);
  });

  it('Should copy prop keys themselves when they are not plain objects',
  function() {
    var o0 = {};
    var o1 = { o2: {
      p0: undefined,
      p1: null,
      p2: true,
      p3: false,
      p4: 0,
      p5: 123,
      p6: '',
      p7: 'abc',
      p8: [1, 2, 3],
      p9: new Date(),
      p10: function() {},
    } };

    if (typeof Symbol === 'function') {
      o1.o2.p11 = Symbol('foo');
    }

    var ret = defaultsDeep(o0, o1);
    expect(ret).to.equal(o0);
    expect(ret.o2).to.equal(o0.o2);
    expect(ret.o2.p0).to.deep.equal(o0.o2.p0);
    expect(ret.o2.p1).to.deep.equal(o0.o2.p1);
    expect(ret.o2.p2).to.deep.equal(o0.o2.p2);
    expect(ret.o2.p3).to.deep.equal(o0.o2.p3);
    expect(ret.o2.p4).to.deep.equal(o0.o2.p4);
    expect(ret.o2.p5).to.deep.equal(o0.o2.p5);
    expect(ret.o2.p6).to.deep.equal(o0.o2.p6);
    expect(ret.o2.p7).to.deep.equal(o0.o2.p7);
    expect(ret.o2.p8).to.deep.equal(o0.o2.p8);
    expect(ret.o2.p9).to.deep.equal(o0.o2.p9);
    expect(ret.o2.p10).to.deep.equal(o0.o2.p10);
    expect(ret.o2.p11).to.deep.equal(o0.o2.p11);
  });

  it('Should copy prop symbols themselves when they are not plain objects',
  function() {
    if (typeof Symbol !== 'function') {
      this.skip();
      return;
    }
    var p0 = Symbol('p0');
    var p1 = Symbol('p1');
    var p2 = Symbol('p2');
    var p3 = Symbol('p3');
    var p4 = Symbol('p4');
    var p5 = Symbol('p5');
    var p6 = Symbol('p5');
    var p7 = Symbol('p7');
    var p8 = Symbol('p8');
    var p9 = Symbol('p9');
    var p10 = Symbol('p10');
    var p11 = Symbol('p11');

    var o0 = {};
    var o1 = { o2: {} };
    o1.o2[p0] = undefined;
    o1.o2[p1] = null;
    o1.o2[p2] = true;
    o1.o2[p3] = false;
    o1.o2[p4] = 0;
    o1.o2[p5] = 123;
    o1.o2[p6] = '';
    o1.o2[p7] = 'abc';
    o1.o2[p8] = [1, 2, 3];
    o1.o2[p9] = new Date();
    o1.o2[p10] = function() {};

    if (Symbol === 'function') {
      o1.o2[p11] = Symbol('foo');
    }

    var ret = defaultsDeep(o0, o1);
    expect(ret).to.equal(o0);
    expect(ret.o2).to.equal(o0.o2);
    expect(ret.o2[p0]).to.deep.equal(o0.o2[p0]);
    expect(ret.o2[p1]).to.deep.equal(o0.o2[p1]);
    expect(ret.o2[p2]).to.deep.equal(o0.o2[p2]);
    expect(ret.o2[p3]).to.deep.equal(o0.o2[p3]);
    expect(ret.o2[p4]).to.deep.equal(o0.o2[p4]);
    expect(ret.o2[p5]).to.deep.equal(o0.o2[p5]);
    expect(ret.o2[p6]).to.deep.equal(o0.o2[p6]);
    expect(ret.o2[p7]).to.deep.equal(o0.o2[p7]);
    expect(ret.o2[p8]).to.deep.equal(o0.o2[p8]);
    expect(ret.o2[p9]).to.deep.equal(o0.o2[p9]);
    expect(ret.o2[p10]).to.deep.equal(o0.o2[p10]);
    expect(ret.o2[p11]).to.deep.equal(o0.o2[p11]);
  });

  it('Should not throw Errors when destination prop keys are read only',
  function() {
    var o0 = {};
    Object.defineProperties(o0, {
      foo: { enumerable: true, value: 0 },
      bar: { enumerable: true, writable: true, value: {} },
      baz: { enumerable: true, value: {} },
    });
    Object.defineProperties(o0.bar, {
      qux: { enumerable: true, value: 2 },
      quux: { enumerable: true, writable: true, value: 3 },
    });
    Object.defineProperties(o0.baz, {
      qux: { enumerable: true, value: 2 },
      quux: { enumerable: true, writable: true, value: 3 },
    });

    var o1 = {
      foo: 10,
      bar: {
        qux: 12,
        quux: 13,
      },
      baz: {
        qux: 12,
        quux: 13,
      },
    };

    var ret = defaultsDeep(o0, o1);
    expect(ret).to.equal(o0);
    expect(ret).to.deep.equal({
      foo: 0,
      bar: {
        qux: 2,
        quux: 3,
      },
      baz: {
        qux: 2,
        quux: 3,
      },
    });
  });

  it('Should not throw Errors when destination prop symbols are read only',
  function() {
    if (typeof Symbol !== 'function') {
      this.skip();
      return;
    }
    var foo = Symbol('foo');
    var bar = Symbol('bar');
    var baz = Symbol('baz');
    var qux = Symbol('qux');
    var quux = Symbol('quux');

    var o0 = {};
    Object.defineProperty(o0, foo, { enumerable: true, value: 0 });
    Object.defineProperty(o0, bar, { enumerable: true, writable: true,
      value: {} });
    Object.defineProperty(o0, baz, { enumerable: true, value: {} });

    Object.defineProperty(o0[bar], qux, { enumerable: true, value: 2 });
    Object.defineProperty(o0[bar], quux, { enumerable: true, writable: true,
      value: 3 });

    Object.defineProperty(o0[baz], qux, { enumerable: true, value: 2 });
    Object.defineProperty(o0[baz], quux, { enumerable: true, writable: true,
      value: 3 });

    var o1 = {};
    o1[foo] = 10;
    o1[bar] = {};
    o1[baz] = {};
    o1[bar][qux] = 12;
    o1[bar][quux] = 13;
    o1[baz][qux] = 12;
    o1[baz][quux] = 13;

    var ret = defaultsDeep(o0, o1);
    expect(ret).to.equal(o0);
    expect(ret[foo]).to.equal(0);
    expect(ret[bar][qux]).to.equal(2);
    expect(ret[bar][quux]).to.equal(3);
    expect(ret[baz][qux]).to.equal(2);
    expect(ret[baz][quux]).to.equal(3);
  });
});
