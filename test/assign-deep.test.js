'use strict';

var chai = require('chai');
var expect = chai.expect;

var fav = {}; fav.prop = require('..');

var assignDeep = fav.prop.assignDeep;

describe('fav.prop.assignDeep', function() {

  it('Should return an empty plain object if arg is nullish', function() {
    expect(assignDeep(undefined)).to.deep.equal({});
    expect(assignDeep(null)).to.deep.equal({});
    expect(assignDeep(undefined, undefined)).to.deep.equal({});
    expect(assignDeep(null, null)).to.deep.equal({});
    expect(assignDeep({}, undefined)).to.deep.equal({});
    expect(assignDeep({}, null)).to.deep.equal({});
    expect(assignDeep(undefined, {})).to.deep.equal({});
    expect(assignDeep(null, {})).to.deep.equal({});
  });

  it('Should copy props of a plain object to a destination object deeply',
  function() {
    var dest = {};
    var src = { a: 0, b: { c: 0 } };
    var ret = assignDeep(dest, src);
    expect(ret).to.equal(dest);
    expect(ret).to.not.equal(src);
    expect(ret).to.deep.equal(src);
    expect(ret.a).to.equal(src.a);
    expect(ret.b).to.not.equal(src.b);
    expect(ret.b).to.deep.equal(src.b);
    expect(ret.b.c).to.equal(src.b.c);
  });

  it('Should merge objects deeply', function() {
    var o1 = { a: { b: { c: 'c1', d: 'd1' } } };
    var o2 = { a: { b: { c: 'c2', e: 'e2' } } };
    var o3 = { a: { b: { c: 'c3', f: { g: 'g3' } } } };
    var ret = assignDeep(o1, o2, o3);
    expect(ret).to.equal(o1);
    expect(ret).to.deep.equal({
      a: { b: { c: 'c3', d: 'd1', e: 'e2', f: { g: 'g3' } } }
    });
    expect(ret.a).to.equal(o1.a);
    expect(ret.a).to.not.equal(o2.a);
    expect(ret.a).to.not.equal(o3.a);
    expect(ret.a.b).to.equal(o1.a.b);
    expect(ret.a.b).to.not.equal(o2.a.b);
    expect(ret.a.b).to.not.equal(o3.a.b);
    expect(ret.a.b.f).to.not.equal(o3.a.b.f);
  });

  it('Should not copy unenumerable props', function() {
    var obj = { a: 1 };
    Object.defineProperties(obj, {
      b: { value: 2 },
      c: { enumerable: true, value: {} },
    });
    Object.defineProperties(obj.c, {
      d: { value: 3 },
      e: { enumerable: true, value: 4 },
    });

    var ret = assignDeep({}, obj);
    expect(ret).to.deep.equal({ a: 1, c: { e: 4 } });
    expect(ret.b).to.be.undefined;
    expect(ret.c.d).to.be.undefined;
  });

  it('Should not copy inherited props', function() {
    function Fn0() {
      this.a0 = 0;
      this.b0 = { c0: 'C0', d0: { e0: 'E0' } };
    }
    function Fn1() {
      this.a1 = 1;
      this.b1 = { c1: 'C1', d1: { e1: 'E1' } };
    }
    Fn1.prototype = new Fn0();

    var fn1 = new Fn1();
    var ret = assignDeep({}, fn1);
    expect(ret).to.deep.equal({ a1: 1, b1: { c1: 'C1', d1: { e1: 'E1' } } });
  });

  it('Should copy symbol-typed properties', function() {
    if (typeof Symbol !== 'function') {
      this.skip();
      return;
    }

    var o0 = { d: {} };
    var o1 = { a: 1 };
    var o2 = { d: {} };
    var symbol0 = Symbol('s1');
    var symbol1 = Symbol('s2');
    var symbol2 = Symbol('s3');
    var symbol3 = Symbol('s4');
    o0[symbol0] = 0;
    o0.d[symbol1] = 1;
    o0.d[symbol2] = 2;
    o2[symbol0] = 20;
    o2.d[symbol1] = 21;
    o2.d[symbol3] = 23;

    var ret = assignDeep(o0, o1, o2);
    expect(ret).to.equal(o0);
    expect(ret).to.deep.equal({ a: 1, d: {} });
    expect(ret[symbol0]).to.equal(20);
    expect(ret.d[symbol1]).to.equal(21);
    expect(ret.d[symbol2]).to.equal(2);
    expect(ret.d[symbol3]).to.equal(23);
  });

  it('Should copy symbol-typed properties (2)', function() {
    if (typeof Symbol !== 'function') {
      this.skip();
      return;
    }

    var sym1 = Symbol('a1');
    var sym2 = Symbol('a2');
    var sym3 = Symbol('a3');

    var o1 = {};
    o1[sym1] = { a: 1 };

    var o2 = {};
    o2[sym1] = {};
    o2[sym1][sym2] = {};
    o2[sym1][sym2][sym3] = 2;

    var ret = assignDeep(o1, o2);
    expect(ret).to.deep.equal({});
    expect(ret[sym1]).to.deep.equal({ a: 1 });
    expect(ret[sym1].a).to.equal(1);
    expect(ret[sym1][sym2]).to.deep.equal({});
    expect(ret[sym1][sym2][sym3]).to.equal(2);
  });

  it('Should not copy unenumerable symbol-typed properties', function() {
    if (typeof Symbol !== 'function') {
      this.skip();
      return;
    }

    var sym00 = Symbol('a0');
    var sym01 = Symbol('a1');
    var sym10 = Symbol('a2');
    var sym11 = Symbol('a3');
    var sym20 = Symbol('a4');
    var sym21 = Symbol('a5');

    var obj = {};
    obj[sym00] = {};
    Object.defineProperty(obj, sym01, { value: {} });
    obj[sym00][sym10] = {};
    Object.defineProperty(obj[sym00], sym11, { value: {} });
    obj[sym00][sym10][sym20] = 1;
    Object.defineProperty(obj[sym00][sym10], sym21, { value: 2 });

    var dest = assignDeep({}, obj);
    expect(dest).to.deep.equal({});
    expect(Object.getOwnPropertySymbols(dest)).to.deep.equal([sym00]);
    expect(Object.getOwnPropertySymbols(dest[sym00])).to.deep.equal([sym10]);
    expect(Object.getOwnPropertySymbols(dest[sym00][sym10])).to.deep
      .equal([sym20]);
    expect(dest[sym00][sym10][sym20]).to.equal(1);

    expect(dest[sym01]).to.be.undefined;
    expect(dest[sym00][sym11]).to.be.undefined;
    expect(dest[sym00][sym10][sym21]).to.be.undefined;
  });

  it('Should not copy inherited symbol-typed properties', function() {
    if (typeof Symbol !== 'function') {
      this.skip();
      return;
    }

    var sym00 = Symbol('s00');
    var sym01 = Symbol('s01');
    var sym10 = Symbol('s10');
    var sym11 = Symbol('s11');
    var sym20 = Symbol('s20');

    var Fn0 = function() {
      this[sym00] = {};
    };
    Fn0.prototype = new function() {
      this[sym01] = {};
    };

    var Fn1 = function() {
      this[sym10] = {};
    };
    Fn1.prototype = new function() {
      this[sym11] = {};
    };

    var src = new Fn0();
    src[sym00] = new Fn1();
    Object.defineProperty(src[sym00][sym10], sym20, { value: 1 });

    var dest = assignDeep({}, src);

    expect(dest).to.deep.equal({});

    // The properties of top level non plain object is copied as a plain object
    expect(dest).to.not.equal(src);
    expect(Object.getOwnPropertySymbols(dest)).to.deep.equal([sym00]);
    expect(dest[sym01]).to.be.undefined;

    // non plain object properties is copyes like primitive properties.
    expect(dest[sym00]).to.equal(src[sym00]);
    expect(dest[sym00][sym10]).to.equal(src[sym00][sym10]);
    expect(dest[sym00][sym11]).to.equal(src[sym00][sym11]);
  });

  it('Should replace first argument which is not a plain object to a plain ' +
  '\n\tobject', function() {
    var o1 = { a: 1 };
    expect(assignDeep(true, o1)).to.not.equal(o1);
    expect(assignDeep(true, o1)).to.deep.equal(o1);
    expect(assignDeep(false, o1)).to.deep.equal(o1);
  });

  it('Should copy properties themselves when they are not plain objects',
  function() {
    var symbol;
    if (typeof Symbol === 'function') {
      symbol = Symbol('foo');
    } else {
      symbol = 'symbol';
    }

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
      p11: symbol,
    } };

    var ret = assignDeep(o0, o1);
    expect(ret).to.equal(o0);
    expect(ret.o2).to.not.equal(o1.o2);
    expect(ret.o2).to.deep.equal(o1.o2);
    expect(ret.o2.p0).to.equal(o1.o2.p0);
    expect(ret.o2.p1).to.equal(o1.o2.p1);
    expect(ret.o2.p2).to.equal(o1.o2.p2);
    expect(ret.o2.p3).to.equal(o1.o2.p3);
    expect(ret.o2.p4).to.equal(o1.o2.p4);
    expect(ret.o2.p5).to.equal(o1.o2.p5);
    expect(ret.o2.p6).to.equal(o1.o2.p6);
    expect(ret.o2.p7).to.equal(o1.o2.p7);
    expect(ret.o2.p8).to.equal(o1.o2.p8);
    expect(ret.o2.p9).to.equal(o1.o2.p9);
    expect(ret.o2.p10).to.equal(o1.o2.p10);
    expect(ret.o2.p11).to.equal(o1.o2.p11);
  });

  it('Should not throw Errors when destination props are read only',
  function() {
    var symbol1, symbol2;
    if (typeof Symbol === 'function') {
      symbol1 = Symbol('s1');
      symbol2 = Symbol('s2');
    }

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

    if (typeof Symbol === 'function') {
      Object.defineProperty(o0, symbol1, { enumerable: true, value: 4 });
      Object.defineProperty(o0, symbol2, {
        enumerable: true,
        writable: true,
        value: 5
      });
      Object.defineProperty(o0.baz, symbol1, { enumerable: true, value: 6 });
      Object.defineProperty(o0.baz, symbol2, {
        enumerable: true,
        writable: true,
        value: 7
      });
    }

    var o1 = {
      foo: 10,
      bar: {
        qux: 12,
        quux: 13,
      },
      baz: {
        qux: 12,
        quux: 13,
      }
    };
    if (typeof Symbol === 'function') {
      o1[symbol1] = 14;
      o1[symbol2] = 15;
      o1.baz[symbol1] = 16;
      o1.baz[symbol2] = 17;
    }

    var ret = assignDeep(o0, o1);
    expect(ret).to.equal(o0);
    expect(ret).to.deep.equal({
      foo: 0,
      bar: {
        qux: 2,
        quux: 13,
      },
      baz: {
        qux: 2,
        quux: 13,
      },
    });

    if (typeof Symbol === 'function') {
      expect(ret[symbol1]).to.equal(4);
      expect(ret[symbol2]).to.equal(15);
      expect(ret.baz[symbol1]).to.equal(6);
      expect(ret.baz[symbol2]).to.equal(17);
    }
  });
});
