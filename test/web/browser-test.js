(function(){
'use strict';


var expect = chai.expect;



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

})();
(function(){
'use strict';


var expect = chai.expect;



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

})();
(function(){
'use strict';


var expect = chai.expect;



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

})();
(function(){
'use strict';


var expect = chai.expect;



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


})();
(function(){
'use strict';


var expect = chai.expect;



var enumAllKeys = fav.prop.enumAllKeys;

describe('fav.prop.enumAllKeys', function() {

  it('Should get all property keys when the argument is a plain object',
  function() {
    expect(enumAllKeys({})).to.have.members([]);
    expect(enumAllKeys({ a: 1, b: true, c: 'C' })).to.have.members(
      ['a', 'b', 'c']);
  });

  it('Should get property keys of prototype', function() {
    function Fn0() {}
    Fn0.prototype.a = 1;
    expect(enumAllKeys(new Fn0())).to.have.members(['a']);

    function Fn1() {
      this.b = true;
      this.c = 'C';
    }
    Fn1.prototype = new Fn0();
    Fn1.prototype.d = 'D';
    expect(enumAllKeys(new Fn1())).to.have.members(['a', 'b', 'c', 'd']);
  });

  it('Should get only enumerable property keys', function() {
    var obj = {};
    Object.defineProperties(obj, {
      a: { enumerable: true, value: 1 },
      b: { value: true },
      c: { value: 'C' },
    });
    expect(enumAllKeys(obj)).to.have.members(['a']);
  });

  it('Should return an empty array when the argument is nullish', function() {
    expect(enumAllKeys(undefined)).to.have.members([]);
    expect(enumAllKeys(null)).to.have.members([]);
  });

  it('Should return an empty array when the argument is primitive type',
  function() {
    expect(enumAllKeys(true)).to.have.members([]);
    expect(enumAllKeys(false)).to.have.members([]);
    expect(enumAllKeys(0)).to.have.members([]);
    expect(enumAllKeys(123)).to.have.members([]);
  });

  it('Should return an empty array when the argument is primitive type',
  function() {
    expect(enumAllKeys('')).to.have.members([]);
    expect(enumAllKeys('abc')).to.have.members(['0', '1', '2']);

    var s = 'abc';
    try {
      s.aaa = 'AAA';
    } catch (e) {
      // Throws TypeError on Node.js v0.11 or later.
      //console.log(e);
    }
    expect(enumAllKeys(s)).to.have.members(['0', '1', '2']);

    try {
      Object.defineProperty(s, 'bbb', { value: 'BBB' });
    } catch (e) {
      //console.log(e);
    }
    expect(enumAllKeys(s)).to.have.members(['0', '1', '2']);
  });

  it('Should return an array of index strings when the argument is a array',
  function() {
    expect(enumAllKeys([])).to.have.members([]);
    expect(enumAllKeys([1, 2, 3])).to.have.members(['0', '1', '2']);

    var a = ['a', 'b'];
    a.aaa = 'AAA';
    expect(enumAllKeys(a)).to.have.members(['0', '1', 'aaa']);

    Object.defineProperty(a, 'bbb', { value: 'BBB' });
    expect(enumAllKeys(a)).to.have.members(['0', '1', 'aaa']);
  });

  it('Should return an empty string when the argument is a symbol',
  function() {
    if (typeof Symbol !== 'function') {
      this.skip();
      return;
    }

    var symbol = Symbol('foo');
    expect(enumAllKeys(symbol)).to.have.members([]);

    try {
      symbol.aaa = 'AAA';
    } catch (e) {
      //console.log('\t', e.message);
    }
    expect(enumAllKeys(symbol)).to.have.members([]);

    try {
      Object.defineProperty(symbol, 'bbb', { value: 'BBB' });
    } catch (e) {
      //console.log(e);
    }
    expect(enumAllKeys(symbol)).to.have.members([]);
  });
});

})();
(function(){
'use strict';


var expect = chai.expect;



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

})();
(function(){
'use strict';


var expect = chai.expect;



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

})();
(function(){
'use strict';


var expect = chai.expect;



var enumOwnKeys = fav.prop.enumOwnKeys;

describe('fav.prop.enumOwnKeys', function() {

  it('Should get enumerable prop keys when arg is a plain object', function() {
    expect(enumOwnKeys({})).to.have.members([]);
    expect(enumOwnKeys({ a: 1, b: true, c: 'C' })).to.have.members(
      ['a', 'b', 'c']);
  });

  it('Should not get property keys of prototype', function() {
    function Fn0() {}
    Fn0.prototype.a = 1;
    expect(enumOwnKeys(new Fn0())).to.have.members([]);

    function Fn1() {
      this.b = true;
      this.c = 'C';
    }
    Fn1.prototype = new Fn0();
    Fn1.prototype.d = 'D';
    expect(enumOwnKeys(new Fn1())).to.have.members(['b', 'c']);
  });

  it('Should get only enumerable property keys', function() {
    var obj = {};
    Object.defineProperties(obj, {
      a: { enumerable: true, value: 1 },
      b: { value: true },
      c: { value: 'C' },
    });
    expect(enumOwnKeys(obj)).to.have.members(['a']);
  });

  it('Should return an empty array when the argument is nullish', function() {
    expect(enumOwnKeys(undefined)).to.have.members([]);
    expect(enumOwnKeys(null)).to.have.members([]);
  });

  it('Should return an empty array when the argument is primitive type',
  function() {
    expect(enumOwnKeys(true)).to.have.members([]);
    expect(enumOwnKeys(false)).to.have.members([]);
    expect(enumOwnKeys(0)).to.have.members([]);
    expect(enumOwnKeys(123)).to.have.members([]);
  });

  it('Should return an array having index strings when the argument is a ' +
  'string', function() {
    expect(enumOwnKeys('')).to.have.members([]);
    expect(enumOwnKeys('abc')).to.have.members(['0', '1', '2']);

    var s = 'abc';
    try {
      s.aaa = 'AAA';
    } catch (e) {
      // Throw TypeError on Node.js version 0.11 or later.
      //console.error('\t', e.message);
    }
    expect(enumOwnKeys(s)).to.have.members(['0', '1', '2']);

    try {
      Object.defineProperty(s, 'bbb', { value: 'BBB' });
    } catch (e) {
      // Throw TypeError on Node.js version 0.11 or later.
      //console.error('\t', e.message);
    }
    expect(enumOwnKeys(s)).to.have.members(['0', '1', '2']);
  });

  it('Should return an array of index strings when the argument is a String' +
  '\n\tobject', function() {
    var s = new String('abc');
    expect(enumOwnKeys(s)).to.have.members(['0', '1', '2']);

    s.aaa = 'AAA';
    expect(enumOwnKeys(s)).to.have.members(['0', '1', '2', 'aaa']);

    Object.defineProperty(s, 'bbb', { value: 'BBB' });
    expect(enumOwnKeys(s)).to.have.members(
      ['0', '1', '2', 'aaa']);
  });

  it('Should return an array of index strings when the argument is a array',
  function() {
    expect(enumOwnKeys([])).to.have.members([]);
    expect(enumOwnKeys([1, 2, 3])).to.have.members(['0', '1', '2']);

    var a = ['a', 'b'];
    a.aaa = 'AAA';
    expect(enumOwnKeys(a)).to.have.members(['0', '1', 'aaa']);

    Object.defineProperty(a, 'bbb', { value: 'BBB' });
    expect(enumOwnKeys(a)).to.have.members(['0', '1', 'aaa']);
  });

  it('Should return appended properties when the argument is a function',
  function() {
    var fn = function() {};
    expect(enumOwnKeys(fn)).to.have.members([]);

    fn.aaa = 'AAA';
    expect(enumOwnKeys(fn)).to.have.members(['aaa']);

    Object.defineProperty(fn, 'bbb', { value: 'BBB' });
    expect(enumOwnKeys(fn)).to.have.members(['aaa']);
  });

  it('Should return an empty string when the argument is a symbol',
  function() {
    if (typeof Symbol !== 'function') {
      this.skip();
      return;
    }

    var symbol = Symbol('foo');
    expect(enumOwnKeys(symbol)).to.have.members([]);

    try {
      symbol.aaa = 'AAA';
    } catch (e) {
      //console.error('\t', e.message);
    }
    expect(enumOwnKeys(symbol)).to.have.members([]);

    try {
      Object.defineProperty(symbol, 'bbb', { value: 'BBB' });
    } catch (e) {
      //console.error('\t', e.message);
    }
    expect(enumOwnKeys(symbol)).to.have.members([]);
  });
});

})();
(function(){
'use strict';


var expect = chai.expect;



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

})();
(function(){
'use strict';


var expect = chai.expect;



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

})();
(function(){
'use strict';


var expect = chai.expect;



var getDeep = fav.prop.getDeep;

describe('fav.prop.get-deep', function() {

  it('Should get value of the specified prop path', function() {
    var obj = {
      a00: {
        a10: { a20: 1, a21: 2, a22: 3, },
        a11: { a20: 4, a23: 5, a24: 6, },
      },
      a01: {
        a10: { a20: 7, a21: 8, a22: 9, },
        a12: {},
      }
    };

    expect(getDeep(obj, [])).to.equal(obj);

    expect(getDeep(obj, ['a00'])).to.equal(obj.a00);
    expect(getDeep(obj, ['a01'])).to.equal(obj.a01);
    expect(getDeep(obj, ['a02'])).to.equal(obj.a02);

    expect(getDeep(obj, ['a00', 'a10'])).to.equal(obj.a00.a10);
    expect(getDeep(obj, ['a00', 'a11'])).to.equal(obj.a00.a11);
    expect(getDeep(obj, ['a01', 'a10'])).to.equal(obj.a01.a10);
    expect(getDeep(obj, ['a01', 'a12'])).to.equal(obj.a01.a12);

    expect(getDeep(obj, ['a00', 'a10', 'a20'])).to.equal(1);
    expect(getDeep(obj, ['a00', 'a10', 'a21'])).to.equal(2);
    expect(getDeep(obj, ['a00', 'a10', 'a22'])).to.equal(3);

    expect(getDeep(obj, ['a00', 'a11', 'a20'])).to.equal(4);
    expect(getDeep(obj, ['a00', 'a11', 'a23'])).to.equal(5);
    expect(getDeep(obj, ['a00', 'a11', 'a24'])).to.equal(6);

    expect(getDeep(obj, ['a01', 'a10', 'a20'])).to.equal(7);
    expect(getDeep(obj, ['a01', 'a10', 'a21'])).to.equal(8);
    expect(getDeep(obj, ['a01', 'a10', 'a22'])).to.equal(9);
  });

  it('Should get undefined when not having the specified prop path',
  function() {
    var obj = {
      a00: {
        a10: { a20: 1, a21: 2, a22: 3, },
        a11: { a20: 4, a23: 5, a24: 6, },
      },
      a01: {
        a10: { a20: 7, a21: 8, a22: 9, },
        a12: {},
      }
    };

    expect(getDeep(obj, ['a', 'b', 'c'])).to.equal(undefined);
    expect(getDeep(obj, ['a00', 'b', 'c'])).to.equal(undefined);
    expect(getDeep(obj, ['a00', 'a10', 'c'])).to.equal(undefined);
  });

  it('Should get undefined when prop path is not an array',
  function() {
    var obj = {
      a00: {
        a10: { a20: 1, a21: 2, a22: 3, },
        a11: { a20: 4, a23: 5, a24: 6, },
      },
      a01: {
        a10: { a20: 7, a21: 8, a22: 9, },
        a12: {},
      }
    };

    expect(getDeep(obj, undefined)).to.equal(undefined);
    expect(getDeep(obj, null)).to.equal(undefined);
    expect(getDeep(obj, true)).to.equal(undefined);
    expect(getDeep(obj, false)).to.equal(undefined);
    expect(getDeep(obj, 0)).to.equal(undefined);
    expect(getDeep(obj, 10)).to.equal(undefined);
    expect(getDeep(obj, '')).to.equal(undefined);
    expect(getDeep(obj, 'a00')).to.equal(undefined);
    expect(getDeep(obj, { a00: 'a00', })).to.equal(undefined);

    if (typeof Symbol === 'function') {
      expect(getDeep(obj, Symbol('a00'))).to.equal(undefined);
    }
  });

  it('Should get obj itself when obj is primitive type and propPath is' +
  '\n\tnullish or empty', function() {
    expect(getDeep(undefined)).to.equal(undefined);
    expect(getDeep(null)).to.equal(null);
    expect(getDeep(true)).to.equal(true);
    expect(getDeep(false)).to.equal(false);
    expect(getDeep(0)).to.equal(0);
    expect(getDeep(123)).to.equal(123);

    expect(getDeep(undefined, [])).to.equal(undefined);
    expect(getDeep(null, [])).to.equal(null);
    expect(getDeep(true, [])).to.equal(true);
    expect(getDeep(false, [])).to.equal(false);
    expect(getDeep(0, [])).to.equal(0);
    expect(getDeep(123, [])).to.equal(123);
  });

  it('Should get prop value even when obj is not a object', function() {
    expect(getDeep([1,2,3], ['length'])).to.equal(3);

    function fn(b, c) {
      return b + c;
    }
    expect(getDeep(fn['length'])).to.equal(2);

    expect(getDeep('ABC'['length'])).to.equal(3);

    expect(getDeep(undefined, ['length'])).to.equal(undefined);
    expect(getDeep(null, ['length'])).to.equal(undefined);
    expect(getDeep(true, ['length'])).to.equal(undefined);
    expect(getDeep(false, ['length'])).to.equal(undefined);
    expect(getDeep(0, ['length'])).to.equal(undefined);
    expect(getDeep(123, ['length'])).to.equal(undefined);
  });

  it('Should get an enumerable property key value', function() {
    var obj = { a: { b: { c: 123 } } };
    expect(getDeep(obj, ['a'])).to.equal(obj.a);
    expect(getDeep(obj, ['a', 'b'])).to.equal(obj.a.b);
    expect(getDeep(obj, ['a', 'b', 'c'])).to.equal(obj.a.b.c);
    expect(getDeep(obj, ['a', 'b', 'c'])).to.equal(123);
  });

  it('Should get an unenumerable property key value', function() {
    var obj = {};
    Object.defineProperty(obj, 'a', { value: {} });
    Object.defineProperty(obj.a, 'b', { value: {} });
    Object.defineProperty(obj.a.b, 'c', { value: 123 });

    expect(getDeep(obj, ['a'])).to.equal(obj.a);
    expect(getDeep(obj, ['a', 'b'])).to.equal(obj.a.b);
    expect(getDeep(obj, ['a', 'b', 'c'])).to.equal(obj.a.b.c);
    expect(getDeep(obj, ['a', 'b', 'c'])).to.equal(123);
  });

  it('Should get an inherited property key value', function() {
    var obj0 = new function() {
      this.a = {};
    };
    Object.defineProperty(obj0.a, 'b', { value: {} });

    obj0.a.b.c = 123;
    function Fn1() {};
    Fn1.prototype = obj0;
    var obj = new Fn1();

    expect(obj.a.b.c).to.equal(123);
    expect(getDeep(obj, ['a'])).to.equal(obj.a);
    expect(getDeep(obj, ['a', 'b'])).to.equal(obj.a.b);
    expect(getDeep(obj, ['a', 'b', 'c'])).to.equal(obj.a.b.c);
    expect(getDeep(obj, ['a', 'b', 'c'])).to.equal(123);
  });

  it('Should get an enumerable property symbol value', function() {
    if (typeof Symbol !== 'function') {
      this.skip();
      return;
    }
    var a = Symbol('a'), b = Symbol('b'), c = Symbol('c');

    var obj = {};
    obj[a] = {};
    obj[a][b] = {};
    obj[a][b][c] = 123;

    expect(getDeep(obj, [a])).to.equal(obj[a]);
    expect(getDeep(obj, [a, b])).to.equal(obj[a][b]);
    expect(getDeep(obj, [a, b, c])).to.equal(obj[a][b][c]);
    expect(getDeep(obj, [a, b, c])).to.equal(123);
  });

  it('Should get an unenumerable property symbol value', function() {
    if (typeof Symbol !== 'function') {
      this.skip();
      return;
    }
    var a = Symbol('a'), b = Symbol('b'), c = Symbol('c');

    var obj = {};
    Object.defineProperty(obj, a, { value: {} });
    Object.defineProperty(obj[a], b, { value: {} });
    Object.defineProperty(obj[a][b], c, { value: 123 });

    expect(getDeep(obj, [a])).to.equal(obj[a]);
    expect(getDeep(obj, [a, b])).to.equal(obj[a][b]);
    expect(getDeep(obj, [a, b, c])).to.equal(obj[a][b][c]);
    expect(getDeep(obj, [a, b, c])).to.equal(123);
  });

  it('Should get an inherited property symbol value', function() {
    if (typeof Symbol !== 'function') {
      this.skip();
      return;
    }
    var a = Symbol('a'), b = Symbol('b'), c = Symbol('c');

    var obj0 = new function() {
      this[a] = {};
    };
    Object.defineProperty(obj0[a], b, { value: {} });
    obj0[a][b][c] = 123;
    function Fn1() {};
    Fn1.prototype = obj0;
    var obj = new Fn1();

    expect(obj[a][b][c]).to.equal(123);
    expect(getDeep(obj, [a])).to.equal(obj[a]);
    expect(getDeep(obj, [a, b])).to.equal(obj[a][b]);
    expect(getDeep(obj, [a, b, c])).to.equal(obj[a][b][c]);
    expect(getDeep(obj, [a, b, c])).to.equal(123);
  });

  it('Should not throw an error when 2nd arg is a Symbol array', function() {
    if (typeof Symbol !== 'function') {
      this.skip();
      return;
    }

    var a = Symbol('a'), b = Symbol('b'), c = Symbol('c');
    var obj = {};
    obj[a] = {};
    obj[a][b] = {};
    obj[a][b][c] = 3;

    expect(getDeep(obj, [[a], b, c])).to.equal(undefined);
    expect(getDeep(obj, [a, [b], c])).to.equal(undefined);
    expect(getDeep(obj, [a, b, [c]])).to.equal(undefined);
  });

  it('Should not allow to use an array as a property', function() {
    var obj = { a: 1, b: { c: 2 }, 'd,e': 3 };
    expect(getDeep(obj, ['a'])).to.equal(1);
    expect(getDeep(obj, [['a']])).to.equal(undefined);
    expect(getDeep(obj, ['b', 'c'])).to.equal(2);
    expect(getDeep(obj, [['b'], 'c'])).to.equal(undefined);
    expect(getDeep(obj, ['b', ['c']])).to.equal(undefined);
    expect(getDeep(obj, ['d,e'])).to.equal(3);
    expect(getDeep(obj, [['d','e']])).to.equal(undefined);

    if (typeof Symbol === 'function') {
      obj = {};
      var a = Symbol('a'), b = Symbol('b'), c = Symbol('c'),
          d = Symbol('d'), e = Symbol('e');
      var de = [d.toString(), e.toString()].toString();
      obj[a] = 1;
      obj[a.toString()] = 11;
      obj[b] = {};
      obj[b][c] = 2;
      obj[b][c.toString()] = 21;
      obj[b.toString()] = {};
      obj[b.toString()][c] = 22;
      obj[de] = 3;
      expect(getDeep(obj, [a])).to.equal(1);
      expect(getDeep(obj, [a.toString()])).to.equal(11);
      expect(getDeep(obj, [[a]])).to.equal(undefined);
      expect(getDeep(obj, [b, c])).to.equal(2);
      expect(getDeep(obj, [b, c.toString()])).to.equal(21);
      expect(getDeep(obj, [b.toString(), c])).to.equal(22);
      expect(getDeep(obj, [[b], c])).to.equal(undefined);
      expect(getDeep(obj, [b, [c]])).to.equal(undefined);
      expect(getDeep(obj, [de])).to.equal(3);
      expect(getDeep(obj, [[d,e]])).to.equal(undefined);
    }
  });
});

})();
(function(){
'use strict';


var expect = chai.expect;



var listOwnKeys = fav.prop.listOwnKeys;

describe('fav.prop.listOwnKeys', function() {

  it('Should get all property keys when the argument is a plain object',
  function() {
    expect(listOwnKeys({})).to.have.members([]);
    expect(listOwnKeys({ a: 1, b: true, c: 'C' })).to.have.members(
      ['a', 'b', 'c']);
  });

  it('Should not get property keys of prototype', function() {
    function Fn0() {}
    Fn0.prototype.a = 1;
    expect(listOwnKeys(new Fn0())).to.have.members([]);

    function Fn1() {
      this.b = true;
      this.c = 'C';
    }
    Fn1.prototype = new Fn0();
    Fn1.prototype.d = 'D';
    Object.defineProperty(Fn1.prototype, 'e', { value: 'E' });
    expect(listOwnKeys(new Fn1())).to.have.members(['b', 'c']);
  });

  it('Should get also unenumerable property keys', function() {
    var obj = {};
    Object.defineProperties(obj, {
      a: { enumerable: true, value: 1 },
      b: { value: true },
      c: { value: 'C' },
    });
    expect(listOwnKeys(obj)).to.have.members(['a', 'b', 'c']);
  });

  it('Should return an empty array when the argument is nullish', function() {
    expect(listOwnKeys(undefined)).to.have.members([]);
    expect(listOwnKeys(null)).to.have.members([]);
  });

  it('Should return an empty array when the argument is primitive type',
  function() {
    expect(listOwnKeys(true)).to.have.members([]);
    expect(listOwnKeys(false)).to.have.members([]);
    expect(listOwnKeys(0)).to.have.members([]);
    expect(listOwnKeys(123)).to.have.members([]);
  });

  it('Should return an array having index strings and `length` when the ' +
  '\n\targument is a string', function() {
    expect(listOwnKeys('')).to.have.members(['length']);
    expect(listOwnKeys('abc')).to.have.members(['0', '1', '2', 'length']);

    var s = 'abc';
    try {
      s.aaa = 'AAA';
    } catch (e) {
      // Throws TypeError on Node.js v0.11 or later.
      //console.log(e);
    }
    expect(listOwnKeys(s)).to.have.members(['0', '1', '2', 'length']);

    try {
      Object.defineProperty(s, 'bbb', { value: 'BBB' });
    } catch (e) {
      //console.log(e);
    }
    expect(listOwnKeys(s)).to.have.members(['0', '1', '2', 'length']);
  });

  it('Should return appended property keys when the argument is a string',
  function() {
    expect(listOwnKeys(new String(''))).to.have.members(['length']);
    expect(listOwnKeys(new String('abc'))).to.have.members(
      ['0', '1', '2', 'length']);

    var s = new String('abc');
    try {
      s.aaa = 'AAA';
    } catch (e) {
      // Throws TypeError on Node.js v0.11 or later.
      //console.log(e);
    }
    expect(listOwnKeys(s)).to.have.members(['0', '1', '2', 'aaa', 'length']);

    try {
      Object.defineProperty(s, 'bbb', { value: 'BBB' });
    } catch (e) {
      //console.log(e);
    }
    expect(listOwnKeys(s)).to.have.members(
      ['0', '1', '2', 'aaa', 'bbb', 'length']);
  });

  it('Should return an array of index strings and `length` when the argument' +
  '\n\tis an array', function() {
    expect(listOwnKeys([])).to.have.members(['length']);
    expect(listOwnKeys([1, 2, 3])).to.have.members(['0', '1', '2', 'length']);

    var a = ['a', 'b'];
    a.aaa = 'AAA';
    expect(listOwnKeys(a)).to.have.members(['0', '1', 'aaa', 'length']);

    try {
      Object.defineProperty(a, 'bbb', { value: 'BBB' });
    } catch (e) {
      //console.log(e);
    }
    expect(listOwnKeys(a)).to.have.members(['0', '1', 'aaa', 'bbb', 'length']);
  });

  it('Should return property keys when the argument is a function',
  function() {
    expect(listOwnKeys(function() {})).to.have.members(
      ['length', 'name', 'prototype']);

    if (isSupportArrowFunction()) {
      eval('expect(listOwnKeys(() => {})).to.have.members(' +
        '["length", "name"])');
    }

    if (isSupportGenerator()) {
      eval('expect(listOwnKeys(function *genFn() {})).to.have.members(' +
        '["length", "name", "prototype"])');
    }

    if (isSupportAsyncAwait()) {
      eval('expect(listOwnKeys(async function asyncFn() {})).to.have.' +
        'members(["length", "name"])');
    }
  });

  it('Should return `length`, `name`, `prototype` and appended property ' +
  'keys\n\twhen the argument is a function', function() {
    var fn = function() {};
    expect(listOwnKeys(fn)).to.have.members(['length', 'name', 'prototype']);

    fn.aaa = 'AAA';
    expect(listOwnKeys(fn)).to.have.members(
      ['length', 'name', 'prototype', 'aaa']);

    Object.defineProperty(fn, 'bbb', { value: 'BBB' });
    expect(listOwnKeys(fn)).to.have.members(
      ['length', 'name', 'prototype', 'aaa', 'bbb']);
  });

  it('Should return an empty string when the argument is a symbol',
  function() {
    if (typeof Symbol !== 'function') {
      this.skip();
      return;
    }

    var symbol = Symbol('foo');
    expect(listOwnKeys(symbol)).to.have.members([]);

    try {
      symbol.aaa = 'AAA';
    } catch (e) {
      // console.error(e);
    }
    expect(listOwnKeys(symbol)).to.have.members([]);

    try {
      Object.defineProperty(symbol, 'bbb', { value: 'BBB' });
    } catch (e) {
      // console.error(e);
    }
    expect(listOwnKeys(symbol)).to.have.members([]);
  });
});


function isSupportArrowFunction() {
  if (isNode()) {
    return semver.gte(process.version, '4.0.0');
  }

  if (typeof xslet !== 'undefined' && typeof xslet.platform !== 'undefined') {
    var ua = xslet.platform.ua;

    // Check by latest version
    if (ua.CHROME) {
      return true;
    }
    if (ua.FIREFOX) {
      return true;
    }
    if (ua.MSIE) {
      return true;
    }
    if (ua.EDGE) {
      return true;
    }
    if (ua.SAFARI) {
      return true;
    }
    if (ua.VIVALDI) {
      return true;
    }
    if (ua.PHANTOMJS) {
      return true;
    }

    return false;
  }

  return false;
}

function isSupportAsyncAwait() {
  if (isNode()) {
    return semver.gte(process.version, '7.6.0');
  }

  if (typeof xslet !== 'undefined' && typeof xslet.platform !== 'undefined') {
    var ua = xslet.platform.ua;

    // Check by latest version
    if (ua.CHROME) {
      return true;
    }
    if (ua.FIREFOX) {
      return true;
    }
    if (ua.MSIE) {
      return true;
    }
    if (ua.EDGE) {
      return true;
    }
    if (ua.SAFARI) {
      return true;
    }
    if (ua.VIVALDI) {
      return true;
    }
    if (ua.PHANTOMJS) {
      return false;
    }

    return false;
  }

  return false;
}

function isSupportGenerator() {
  if (isNode()) {
    return semver.gte(process.version, '4.0.0');
  }

  if (typeof xslet !== 'undefined' && typeof xslet.platform !== 'undefined') {
    var ua = xslet.platform.ua;

    // Check by latest version
    if (ua.CHROME) {
      return true;
    }
    if (ua.FIREFOX) {
      return true;
    }
    if (ua.MSIE) {
      return true;
    }
    if (ua.EDGE) {
      return true;
    }
    if (ua.SAFARI) {
      return true;
    }
    if (ua.VIVALDI) {
      return true;
    }
    if (ua.PHANTOMJS) {
      return false;
    }
  }

  return false;
}

function isNode() {
  if (typeof process === 'object') {
    if (typeof process.kill === 'function') { // exists from v0.0.6
      return true;
    }
  }
  return false;
}

})();
(function(){
'use strict';


var expect = chai.expect;


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

})();
(function(){
'use strict';


var expect = chai.expect;



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

})();
(function(){
'use strict';


var expect = chai.expect;





var omitDeep = fav.prop.omitDeep;
var assignDeep = fav.prop.assignDeep;
var visit = fav.prop.visit;

describe('fav.prop.omit-deep', function() {
  it('Should create a new object', function() {
    var src = { a: 1, b: { c: 2 }, d: 3 };
    expect(omitDeep(src)).to.not.equal(src);
    expect(omitDeep(src)).to.deep.equal(src);
  });

  it('Should copy prop keys deeply to a new plain object except specified' +
  '\n\tprop key paths', function() {
    var src = { a: 1, b: { c: 2 }, d: 3 };

    var exp = assignDeep({}, src);
    delete exp.a;
    expect(omitDeep(src, [['a']])).to.deep.equal(exp);

    exp = assignDeep({}, src);
    delete exp.b;
    expect(omitDeep(src, [['b']])).to.deep.equal(exp);

    exp = assignDeep({}, src);
    delete exp.b.c;
    expect(omitDeep(src, [['b', 'c']])).to.deep.equal(exp);

    exp = assignDeep({}, src);
    delete exp.d;
    expect(omitDeep(src, [['d']])).to.deep.equal(exp);

    exp = assignDeep({}, src);
    delete exp.a;
    delete exp.b.c;
    expect(omitDeep(src, [['a'], ['b', 'c']])).to.deep.equal(exp);
  });

  it('Should copy prop symbols deeply to a new plain object except specified' +
  '\n\tprop symbol paths', function() {
    if (typeof Symbol !== 'function') {
      this.skip();
      return;
    }

    var a = Symbol('a');
    var b = Symbol('b');
    var c = Symbol('c');
    var d = Symbol('d');

    var src = {};
    src[a] = 1;
    src[b] = {};
    src[b][c] = 2;
    src[d] = 3;

    expect(src[a]).to.equal(1);
    expect(src[b][c]).to.deep.equal(2);
    expect(src[d]).to.equal(3);

    var exp = assignDeep({}, src);
    delete exp[a];
    var dest = omitDeep(src, [[a]]);
    expect(dest[a]).to.equal(undefined);
    expect(dest[b][c]).to.equal(2);
    expect(dest[d]).to.equal(3);

    exp = assignDeep({}, src);
    delete exp[b];
    dest = omitDeep(src, [[b]]);
    expect(dest[a]).to.equal(1);
    expect(dest[b]).to.deep.equal(undefined);
    expect(dest[d]).to.equal(3);

    exp = assignDeep({}, src);
    delete exp[b][c];
    dest = omitDeep(src, [[b, c]]);
    expect(dest[a]).to.equal(1);
    expect(dest[b]).to.deep.equal({});
    expect(dest[b][c]).to.deep.equal(undefined);
    expect(dest[d]).to.equal(3);

    exp = assignDeep({}, src);
    delete exp[d];
    dest = omitDeep(src, [[d]]);
    expect(dest[a]).to.equal(1);
    expect(dest[b][c]).to.deep.equal(2);

    exp = assignDeep({}, src);
    delete exp[a];
    delete exp[b][c];
    dest = omitDeep(src, [[a], [b, c]]);
    expect(dest[d]).to.equal(3);
  });

  it('Should not omit props when 2nd arg is a string', function() {
    var src = { a: 1, b: { c: 2 }, d: 3 };
    var exp = assignDeep({}, src);

    expect(omitDeep(src, 'a')).to.deep.equal(exp);
    expect(omitDeep(src, 'b')).to.deep.equal(exp);
    expect(omitDeep(src, 'b.c')).to.deep.equal(exp);
    expect(omitDeep(src, 'b,c')).to.deep.equal(exp);
    expect(omitDeep(src, 'd')).to.deep.equal(exp);
  });

  it('Should not omit props when 2nd arg is a symbol', function() {
    if (typeof Symbol !== 'function') {
      this.skip();
      return;
    }

    var a = Symbol('a');
    var b = Symbol('b');
    var c = Symbol('c');
    var d = Symbol('d');

    var src = {};
    src[a] = 1;
    src[b] = {};
    src[b][c] = 2;
    src[d] = 3;

    expect(src[a]).to.equal(1);
    expect(src[b][c]).to.deep.equal(2);
    expect(src[d]).to.equal(3);

    var dest = omitDeep(src, a);
    expect(dest[a]).to.equal(1);
    expect(dest[b][c]).to.equal(2);
    expect(dest[d]).to.equal(3);

    dest = omitDeep(src, b);
    expect(dest[a]).to.equal(1);
    expect(dest[b][c]).to.equal(2);
    expect(dest[d]).to.equal(3);

    dest = omitDeep(src, d);
    expect(dest[a]).to.equal(1);
    expect(dest[b][c]).to.deep.equal(2);
    expect(dest[d]).to.equal(3);
  });

  it('Should not omit props when 2nd arg is a string array', function() {
    var src = { a: 1, b: { c: 2 }, d: 3 };

    var exp = assignDeep({}, src);
    expect(omitDeep(src, ['a'])).to.deep.equal(exp);
    expect(omitDeep(src, ['b'])).to.deep.equal(exp);
    expect(omitDeep(src, ['d'])).to.deep.equal(exp);
    expect(omitDeep(src, ['b', 'c'])).to.deep.equal(exp);
  });

  it('Should not omit props when 2nd arg is a Symbol array', function() {
    if (typeof Symbol !== 'function') {
      this.skip();
      return;
    }

    var a = Symbol('a');
    var b = Symbol('b');
    var c = Symbol('c');
    var d = Symbol('d');

    var src = {};
    src[a] = 1;
    src[b] = {};
    src[b][c] = 2;
    src[d] = 3;

    var dest = omitDeep(src, [a]);
    expect(dest[a]).to.equal(1);
    expect(dest[b][c]).to.equal(2);
    expect(dest[d]).to.equal(3);

    dest = omitDeep(src, [b]);
    expect(dest[a]).to.equal(1);
    expect(dest[b][c]).to.equal(2);
    expect(dest[d]).to.equal(3);

    dest = omitDeep(src, [d]);
    expect(dest[a]).to.equal(1);
    expect(dest[b][c]).to.equal(2);
    expect(dest[d]).to.equal(3);

    dest = omitDeep(src, [b, c]);
    expect(dest[a]).to.equal(1);
    expect(dest[b][c]).to.equal(2);
    expect(dest[d]).to.equal(3);
  });

  it('Should ignore if specified prop key paths do not exist', function() {
    var src = { a: 1, b: { c: 2 }, d: 3 };

    var exp = assignDeep({}, src);
    expect(omitDeep(src, [['x']])).to.deep.equal(exp);
    expect(omitDeep(src, [['b', 'y']])).to.deep.equal(exp);
    expect(omitDeep(src, [['z', 'c']])).to.deep.equal(exp);
  });

  it('Should ignore if specified prop symbol paths do not exist', function() {
    if (typeof Symbol !== 'function') {
      this.skip();
      return;
    }

    var a = Symbol('a');
    var b = Symbol('b');
    var c = Symbol('c');
    var d = Symbol('d');
    var x = Symbol('x');
    var y = Symbol('y');
    var z = Symbol('z');

    var src = {};
    src[a] = 1;
    src[b] = {};
    src[b][c] = 2;
    src[d] = 3;

    var exp = assignDeep({}, src);
    expect(omitDeep(src, [[x]])).to.deep.equal(exp);
    expect(omitDeep(src, [[b, y]])).to.deep.equal(exp);
    expect(omitDeep(src, [[z, c]])).to.deep.equal(exp);
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

    var ret = omitDeep(obj);
    expect(ret).to.deep.equal({ a: 1, c: { e: 4 } });
    expect(ret.b).to.be.undefined;
    expect(ret.c.d).to.be.undefined;
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
    Fn1.prototype = new Fn0();

    var fn1 = new Fn1();
    var ret = omitDeep(fn1);
    expect(ret).to.deep.equal({ a1: 1, b1: { c1: 'C1', d1: { e1: 'E1' } } });
  });

  it('Should not copy unenumerable prop symbols', function() {
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

    var dest = omitDeep(obj);
    expect(dest).to.deep.equal({});
    expect(Object.getOwnPropertySymbols(dest)).to.deep.equal([sym00]);
    expect(Object.getOwnPropertySymbols(dest[sym00])).to.deep.equal([sym10]);
    expect(Object.getOwnPropertySymbols(dest[sym00][sym10])).to.deep
      .equal([sym20]);
    expect(dest[sym00][sym10][sym20]).to.equal(1);
  });

  it('Should not copy inherited prop symbols', function() {
    if (typeof Symbol !== 'function') {
      this.skip();
      return;
    }

    var sym00 = Symbol('a0');
    var sym01 = Symbol('a1');
    var sym10 = Symbol('a2');
    var sym11 = Symbol('a3');
    var sym20 = Symbol('a4');

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

    var dest = omitDeep(src);

    expect(dest).to.deep.equal({});

    // The props of top level non plain object is copied as a plain object
    expect(dest).to.not.equal(src);
    expect(Object.getOwnPropertySymbols(dest)).to.deep.equal([sym00]);
    expect(dest[sym01]).to.be.undefined;

    // non plain object props is copied like primitive props.
    expect(dest[sym00]).to.equal(src[sym00]);
    expect(dest[sym00][sym10]).to.equal(src[sym00][sym10]);
    expect(dest[sym00][sym11]).to.equal(src[sym00][sym11]);
  });

  it('Should return an empty plain object when first arg is not a object',
  function() {
    var srcs = [
      undefined,
      null,
      true,
      false,
      0,
      123,
      function() {},
    ];

    if (typeof Symbol === 'function') {
      srcs.push(Symbol('abc'));
    }

    srcs.forEach(function(src) {
      var dest = omitDeep(src);
      expect(dest).to.deep.equal({});
      expect(Object.getOwnPropertyNames(dest)).to.deep.equal([]);
      if (typeof Symbol === 'function') {
        expect(Object.getOwnPropertySymbols(dest)).to.deep.equal([]);
      }
    });
  });

  it('Should return a plain object of which props are index strings' +
  '\n\twhen 1st arg is a string', function() {
    expect(omitDeep('', [])).to.deep.equal({});
    expect(omitDeep('abc', [])).to.deep.equal({ 0: 'a', 1: 'b', 2: 'c' });
  });

  it('Should return a plain object of which props are index strings' +
  '\n\twhen 1st arg is an array', function() {
    expect(omitDeep([], [])).to.deep.equal({});
    expect(omitDeep(['a', 'b'], [])).to.deep.equal({ 0: 'a', 1: 'b' });
  });

  it('Should return a plain object of which props are attached' +
  '\n\twhen 1st arg is a function', function() {
    expect(omitDeep(function() {}, [])).to.deep.equal({});

    var fn = function() {};
    fn.a = 'A';
    fn.b = { c: 'C' };
    expect(omitDeep(fn, [])).to.deep.equal({ a: 'A', b: { c: 'C' } });
  });

  it('Should return an full assigned new object when second arg is not an' +
  ' array', function() {
    var obj = { a: 'A', b: { c: 'C', d: 'D' } };
    var expected = assignDeep({}, obj);
    expect(omitDeep(obj, undefined)).to.deep.equal(expected);
    expect(omitDeep(obj, null)).to.deep.equal(expected);
    expect(omitDeep(obj, true)).to.deep.equal(expected);
    expect(omitDeep(obj, false)).to.deep.equal(expected);
    expect(omitDeep(obj, 0)).to.deep.equal(expected);
    expect(omitDeep(obj, 123)).to.deep.equal(expected);
    expect(omitDeep(obj, '')).to.deep.equal(expected);
    expect(omitDeep(obj, 'a')).to.deep.equal(expected);
    expect(omitDeep(obj, {})).to.deep.equal(expected);
    expect(omitDeep(obj, { a: 1, b: 2 })).to.deep.equal(expected);
    expect(omitDeep(obj, function a() {})).to.deep.equal(expected);

    if (typeof Symbol === 'function') {
      expect(omitDeep(obj, Symbol('a'))).to.deep.equal(expected);
    }
  });

  it('Should ignore when props are arrays of Symbols', function() {
    if (typeof Symbol !== 'function') {
      this.skip();
      return;
    }

    var a = Symbol('a'), b = Symbol('b');
    var ab = a.toString() + ',' + b.toString();
    var obj = {};
    obj[a] = {};
    obj[a][b] = 123;
    obj[ab] = 456;

    var ret = omitDeep(obj, [[[a,b]]]);
    expect(ret[a][b]).to.equal(123);
    expect(ret[ab]).to.equal(456);
  });

  it('Should not allow to use an array as a property', function() {
    var obj = { a: { 'b,c': 1, d: 2 } };
    var ret = omitDeep(obj, [['a', ['b','c']], ['a', 'd']]);
    expect(ret).to.deep.equal({ a: { 'b,c': 1 } });

    ret = omitDeep(obj, [['a', 'b,c'], ['a', ['d']]]);
    expect(ret).to.deep.equal({ a: { 'd': 2 } });

    ret = omitDeep(obj, [[['a'], 'b,c'], [['a'], 'd']]);
    expect(ret).to.deep.equal(obj);
  });

  [100, 500, 1000].forEach(function(num) {
    it('Should omit normally when count of propPaths (2nd argument) ' +
    'is a lot\n\t(' +
    num + 'x' + num + ')', function() {
      this.timeout(0);

      var obj = {};
      for (var i = 0; i < num; i++) {
        var child = {};
        for (var j = 0; j < num; j++) {
          child['b' + j] = 'A' + i + 'B' + j;
        }
        obj['a' + i] = child;
      }
      var expected = {};
      var omittedKeys = [];
      visit(obj, function(key, value, index, count, parentKeys) {
        switch (parentKeys.length) {
          case 0: {
            expected[key] = {};
            break;
          }
          case 1: {
            omittedKeys.push(parentKeys.concat(key));
            break;
          }
        }
      });
      expect(omitDeep(obj, omittedKeys)).to.deep.equal(expected);
    });
  });
});

})();
(function(){
'use strict';


var expect = chai.expect;


var omit = fav.prop.omit;


var assign = fav.prop.assign;

describe('fav.prop.omit', function() {

  it('Should return a new plain object which is copied prop keys except' +
  '\n\tspecified', function() {
    var src = { a: 1, b: 2, c: 3 };
    expect(omit(src, [])).to.not.equal(src);
    expect(omit(src, [])).to.deep.equal(src);

    expect(omit(src, ['c'])).to.deep.equal({ a: 1, b: 2 });
    expect(omit(src, ['c', 'a'])).to.deep.equal({ b: 2 });
    expect(omit(src, ['c', 'a', 'b'])).to.deep.equal({});
  });

  it('Should return a new plain object which is copied prop symbols except' +
  '\n\tspecified', function() {
    if (typeof Symbol !== 'function') {
      this.skip();
      return;
    }

    var a = Symbol('a');
    var b = Symbol('b');
    var c = Symbol('c');

    var src = {};
    src[a] = 1;
    src[b] = 2;
    src[c] = 3;

    var ret = omit(src, []);
    expect(Object.getOwnPropertySymbols(ret)).to.has.members([a, b, c]);
    expect(ret[a]).to.equal(1);
    expect(ret[b]).to.equal(2);
    expect(ret[c]).to.equal(3);

    ret = omit(src, [c]);
    expect(Object.getOwnPropertySymbols(ret)).to.has.members([a, b]);
    expect(ret[a]).to.equal(1);
    expect(ret[b]).to.equal(2);

    ret = omit(src, [c, a]);
    expect(Object.getOwnPropertySymbols(ret)).to.has.members([b]);
    expect(ret[b]).to.equal(2);

    ret = omit(src, [c, a, b]);
    expect(Object.getOwnPropertySymbols(ret)).to.has.members([]);
  });

  it('Should not return unenumerable prop keys', function() {
    var obj = {};
    Object.defineProperties(obj, {
      a: { value: 1 },
      b: { enumerable: true, value: 2 },
      c: { enumerable: true, value: 3 },
    });
    expect(omit(obj, ['a', 'b', 'c'])).to.deep.equal({});
    expect(omit(obj, ['b'])).to.deep.equal({ c: 3 });
  });

  it('Should not return unenumerable prop symbols', function() {
    if (typeof Symbol !== 'function') {
      this.skip();
      return;
    }
    var a = Symbol('a');
    var b = Symbol('b');
    var c = Symbol('c');

    var obj = {};
    obj[a] = 1;
    Object.defineProperty(obj, b, { value: 2 });
    Object.defineProperty(obj, c, { enumerable: true, value: 3 });

    var ret = omit(obj, [a, b, c]);
    expect(Object.getOwnPropertySymbols(ret)).to.has.members([]);

    ret = omit(obj, [a]);
    expect(Object.getOwnPropertySymbols(ret)).to.has.members([c]);
    expect(ret[c]).to.equal(3);
  });

  it('Should not return inherited prop keys', function() {
    function Fn1() {
      this.a = 1;
      this.b = 2;
    }
    function Fn2() {
      this.c = 3;
    }
    Fn1.prototype = new Fn2();
    var obj = new Fn1();

    var ret = omit(obj, ['a', 'b', 'c']);
    expect(ret).to.deep.equal({});

    ret = omit(obj, ['a']);
    expect(ret).to.deep.equal({ b: 2 });
  });

  it('Should not return inherited prop symbols', function() {
    if (typeof Symbol !== 'function') {
      this.skip();
      return;
    }
    var a = Symbol('a');
    var b = Symbol('b');
    var c = Symbol('c');

    function Fn1() {
      this[a] = 1;
      this[b] = 2;
    }
    function Fn2() {
      this[c] = 3;
    }
    Fn1.prototype = new Fn2();
    var obj = new Fn1();

    var ret = omit(obj, [a, b, c]);
    expect(Object.getOwnPropertySymbols(ret)).to.has.members([]);

    ret = omit(obj, [a]);
    expect(Object.getOwnPropertySymbols(ret)).to.has.members([b]);
    expect(ret[b]).to.equal(2);
  });

  it('Should return an empty plain object when first arg is not a object',
  function() {
    expect(omit(undefined, ['a'])).to.deep.equal({});
    expect(omit(null, ['a'])).to.deep.equal({});
    expect(omit(true, ['a'])).to.deep.equal({});
    expect(omit(false, ['a'])).to.deep.equal({});
    expect(omit(0, ['a'])).to.deep.equal({});
    expect(omit(123, ['a'])).to.deep.equal({});

    if (typeof Symbol === 'function') {
      expect(omit(Symbol('foo'), ['a'])).to.deep.equal({});
    }

    // string and array are exceptions
    expect(omit('', ['length'])).to.deep.equal({});
    expect(omit('ABC', ['0'])).to.deep.equal({ '1': 'B', '2': 'C' });
    expect(omit([], ['length'])).to.deep.equal({});
    expect(omit([1, 2, 3], ['0'])).to.deep.equal({ '1': 2, '2': 3 });

    // function can have enum props
    var fn = function() {};
    expect(omit(fn, ['name'])).to.deep.equal({});
    fn.a = 1;
    fn.b = 2;
    expect(omit(fn, ['a'])).to.deep.equal({ b: 2 });
  });

  it('Should return an full assigned object when second arg is not an array',
  function() {
    var src = { a: 1, b: 2, c: 3 };
    [undefined, null, true, false, 0, 123, '', 'a', {}, { a: 'b' },
     function() {}
    ].forEach(function(arg2) {
      expect(omit(src, arg2)).to.not.equal(src);
      expect(omit(src, arg2)).to.deep.equal(src);
    });
  });

  it('Should omit normally when length of second argument is a lot',
  function() {
    var obj1 = {};
    for (var i = 0; i < 5000; i++) {
      obj1['a' + i] = i;
    }

    var obj2 = {};
    for (var j = 0; j < 5000; j++) {
      obj2['b' + j] = j;
    }

    var src = assign({}, obj1, obj2);

    var keys = Object.keys(obj1).reverse();
    for (var k = 0; k < 100; k++) {
      keys.push('c' + k);
    }
    expect(omit(src, keys)).to.deep.equal(obj2);
  });

  it('Should not throw an error when 2nd arg contains a Symbol array',
  function() {
    if (typeof Symbol !== 'function') {
      this.skip();
      return;
    }

    var a = Symbol('a'), b = Symbol('b');
    var obj = {};
    obj[a] = {};
    obj[a][b] = 123;

    expect(omit(obj, [[a]])[a][b]).to.equal(123);
  });

  it('Should not allow to use an array as a property', function() {
    var obj = {};
    obj['a'] = 1;
    obj['a,b'] = 2;
    expect(obj.a).to.equal(1);
    expect(obj[['a']]).to.equal(1);
    expect(obj['a,b']).to.equal(2);
    expect(obj[['a','b']]).to.equal(2);

    var expected0 = assign({}, obj);
    var expected1 = { a: 1 };
    var expected2 = {};
    expected2['a,b'] = 2;

    expect(omit(obj, ['a'])).to.deep.equal(expected2);
    expect(omit(obj, ['a,b'])).to.deep.equal(expected1);
    expect(omit(obj, ['a', 'a,b'])).to.deep.equal({});

    expect(omit(obj, [['a']])).to.deep.equal(expected0);
    expect(omit(obj, [['a','b']])).to.deep.equal(expected0);

    expect(omit(obj, [['a','b'], 'a'])).to.deep.equal(expected2);
    expect(omit(obj, [['a'], 'a,b'])).to.deep.equal(expected1);
    expect(omit(obj, [['a'], ['a','b']])).to.deep.equal(expected0);
  });
});

})();
(function(){
'use strict';


var expect = chai.expect;





var pickDeep = fav.prop.pickDeep;
var visit = fav.prop.visit;
var setDeep = fav.prop.setDeep;

describe('fav.prop.pick-deep', function() {

  it('Should create a new object', function() {
    var src = { a: 1, b: { c: { d: 2 } }, e: 3 };
    expect(pickDeep(src)).to.not.equal(src);
    expect(pickDeep(src)).to.deep.equal({});
  });

  it('Should copy prop keys deeply to a new plain object only specified' +
  '\n\tprop key paths', function() {
    var src = { a: 1, b: { c: { d: 2 } }, e: 3 };
    expect(pickDeep(src, [['a']])).to.deep.equal({ a: 1 });
    expect(pickDeep(src, [['b']])).to.deep.equal({ b: { c: { d: 2 } } });
    expect(pickDeep(src, [['b', 'c']])).to.deep.equal({ b: { c: { d: 2 } } });
    expect(pickDeep(src, [['b', 'c', 'd']])).to.deep.equal(
      { b: { c: { d: 2 } } });
    expect(pickDeep(src, [['e']])).to.deep.equal({ e: 3 });
  });

  it('Should not equal a value (!==) when the value is plain object',
  function() {
    var src = { a: 1, b: { c: { d: 2 } }, e: 3 };

    var ret = pickDeep(src, [['b']]);
    expect(ret).to.deep.equal({ b: { c: { d: 2 } } });
    expect(ret.b).to.not.equal(src.b);
    expect(ret.b.c).to.not.equal(src.b.c);

    ret = pickDeep(src, [['b', 'c']]);
    expect(ret).to.deep.equal({ b: { c: { d: 2 } } });
    expect(ret.b).to.not.equal(src.b);
    expect(ret.b.c).to.not.equal(src.b.c);

    ret = pickDeep(src, [['b', 'c', 'd']]);
    expect(ret).to.deep.equal({ b: { c: { d: 2 } } });
    expect(ret.b).to.not.equal(src.b);
    expect(ret.b.c).to.not.equal(src.b.c);
  });

  it('Should copy prop symbols deeply to a new plain object except specified' +
  '\n\tprop symbol paths', function() {
    if (typeof Symbol !== 'function') {
      this.skip();
      return;
    }

    var a = Symbol('a');
    var b = Symbol('b');
    var c = Symbol('c');
    var d = Symbol('d');

    var src = {};
    src[a] = 1;
    src[b] = {};
    src[b][c] = 2;
    src[d] = 3;

    expect(src[a]).to.equal(1);
    expect(src[b][c]).to.equal(2);
    expect(src[d]).to.equal(3);

    var ret = pickDeep(src, [[a]]);
    expect(ret[a]).to.equal(1);
    expect(ret[b]).to.equal(undefined);
    expect(ret[d]).to.equal(undefined);

    ret = pickDeep(src, [[b]]);
    expect(ret[a]).to.equal(undefined);
    expect(ret[b][c]).to.equal(2);
    expect(ret[b]).to.not.equal(src[b]);
    expect(ret[d]).to.equal(undefined);

    ret = pickDeep(src, [[b,c]]);
    expect(ret[a]).to.equal(undefined);
    expect(ret[b][c]).to.equal(2);
    expect(ret[b]).to.not.equal(src[b]);
    expect(ret[d]).to.equal(undefined);

    ret = pickDeep(src, [[d]]);
    expect(ret[a]).to.equal(undefined);
    expect(ret[b]).to.equal(undefined);
    expect(ret[d]).to.equal(3);
  });

  it('Should not pick props when 2nd arg is a string', function() {
    var src = { a: 1, b: { c: 2 }, d: 3 };

    expect(pickDeep(src, 'a')).to.deep.equal({});
    expect(pickDeep(src, 'b')).to.deep.equal({});
    expect(pickDeep(src, 'b.c')).to.deep.equal({});
    expect(pickDeep(src, 'b,c')).to.deep.equal({});
    expect(pickDeep(src, 'd')).to.deep.equal({});
  });

  it('Should not pick props when 2nd arg is a symbol', function() {
    if (typeof Symbol !== 'function') {
      this.skip();
      return;
    }

    var a = Symbol('a');
    var b = Symbol('b');
    var c = Symbol('c');
    var d = Symbol('d');

    var src = {};
    src[a] = 1;
    src[b] = {};
    src[b][c] = 2;
    src[d] = 3;

    expect(src[a]).to.equal(1);
    expect(src[b][c]).to.equal(2);
    expect(src[d]).to.equal(3);

    var ret = pickDeep(src, a);
    expect(ret[a]).to.equal(undefined);
    expect(ret[b]).to.equal(undefined);
    expect(ret[d]).to.equal(undefined);

    ret = pickDeep(src, b);
    expect(ret[a]).to.equal(undefined);
    expect(ret[b]).to.equal(undefined);
    expect(ret[d]).to.equal(undefined);

    ret = pickDeep(src, d);
    expect(ret[a]).to.equal(undefined);
    expect(ret[b]).to.equal(undefined);
    expect(ret[d]).to.equal(undefined);
  });

  it('Should not pick props when 2nd arg is a string array', function() {
    var src = { a: 1, b: { c: 2 }, d: 3 };

    expect(pickDeep(src, ['a'])).to.deep.equal({});
    expect(pickDeep(src, ['b'])).to.deep.equal({});
    expect(pickDeep(src, ['b','c'])).to.deep.equal({});
    expect(pickDeep(src, ['d'])).to.deep.equal({});
  });

  it('Should not pick props when 2nd arg is a symbol array', function() {
    if (typeof Symbol !== 'function') {
      this.skip();
      return;
    }

    var a = Symbol('a');
    var b = Symbol('b');
    var c = Symbol('c');
    var d = Symbol('d');

    var src = {};
    src[a] = 1;
    src[b] = {};
    src[b][c] = 2;
    src[d] = 3;

    expect(src[a]).to.equal(1);
    expect(src[b][c]).to.equal(2);
    expect(src[d]).to.equal(3);

    var ret = pickDeep(src, [a]);
    expect(ret[a]).to.equal(undefined);
    expect(ret[b]).to.equal(undefined);
    expect(ret[d]).to.equal(undefined);

    ret = pickDeep(src, [b]);
    expect(ret[a]).to.equal(undefined);
    expect(ret[b]).to.equal(undefined);
    expect(ret[d]).to.equal(undefined);

    ret = pickDeep(src, [d]);
    expect(ret[a]).to.equal(undefined);
    expect(ret[b]).to.equal(undefined);
    expect(ret[d]).to.equal(undefined);
  });

  it('Should ignore if specified prop key paths do not exist', function() {
    var src = { a: 1, b: { c: 2 }, d: 3 };

    expect(pickDeep(src, [['x']])).to.deep.equal({});
    expect(pickDeep(src, [['b', 'y']])).to.deep.equal({});
    expect(pickDeep(src, [['z', 'c']])).to.deep.equal({});
  });

  it('Should ignore if specified prop symbol paths do not exist', function() {
    if (typeof Symbol !== 'function') {
      this.skip();
      return;
    }

    var a = Symbol('a');
    var b = Symbol('b');
    var c = Symbol('c');
    var d = Symbol('d');
    var x = Symbol('x');
    var y = Symbol('y');
    var z = Symbol('z');

    var src = {};
    src[a] = 1;
    src[b] = {};
    src[b][c] = 2;
    src[d] = 3;

    var ret = pickDeep(src, [[x]]);
    expect(ret[x]).to.equal(undefined);
    expect(ret[a]).to.equal(undefined);
    expect(ret[b]).to.equal(undefined);
    expect(ret[c]).to.equal(undefined);

    ret = pickDeep(src, [[b, y]]);
    expect(ret[a]).to.equal(undefined);
    expect(ret[b]).to.equal(undefined);
    expect(ret[c]).to.equal(undefined);

    ret = pickDeep(src, [[z, c]]);
    expect(ret[z]).to.equal(undefined);
    expect(ret[a]).to.equal(undefined);
    expect(ret[b]).to.equal(undefined);
    expect(ret[c]).to.equal(undefined);
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

    expect(obj.a).to.equal(1);
    expect(obj.b).to.equal(2);
    expect(obj.c.d).to.equal(3);
    expect(obj.c.e).to.equal(4);

    var ret = pickDeep(obj, [['a'], ['b'], ['c','d'], ['c', 'e']]);
    expect(ret.a).to.equal(1);
    expect(ret.b).to.equal(undefined);
    expect(ret.c.d).to.equal(undefined);
    expect(ret.c.e).to.equal(4);
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
    Fn1.prototype = new Fn0();

    var fn1 = new Fn1();
    var ret = pickDeep(fn1, [['a0'], ['b0'], ['a1'], ['b1']]);
    expect(ret).to.deep.equal({ a1: 1, b1: { c1: 'C1', d1: { e1: 'E1' } } });

    ret = pickDeep(fn1,
      [['b0', 'c0'], ['b0', 'd0'], ['b1', 'c1'], ['b1', 'd1']]);
    expect(ret).to.deep.equal({ b1: { c1: 'C1', d1: { e1: 'E1' } } });

    ret = pickDeep(fn1, [['b0', 'd0', 'e0'], ['b1', 'd1', 'e1']]);
    expect(ret).to.deep.equal({ b1: { d1: { e1: 'E1' } } });
  });

  it('Should not copy unenumerable prop symbols', function() {
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

    var ret = pickDeep(obj, [[sym00], [sym01]]);
    expect(Object.getOwnPropertySymbols(ret)).to.deep.equal([sym00]);
    expect(Object.getOwnPropertySymbols(ret[sym00])).to.deep.equal([sym10]);
    expect(Object.getOwnPropertySymbols(ret[sym00][sym10])).to.deep.equal(
      [sym20]);
    expect(ret[sym00][sym10][sym20]).to.equal(1);
  });

  it('Should not copy inherited prop symbols', function() {
    if (typeof Symbol !== 'function') {
      this.skip();
      return;
    }

    var sym00 = Symbol('a0');
    var sym01 = Symbol('a1');
    var sym10 = Symbol('a2');
    var sym11 = Symbol('a3');
    var sym20 = Symbol('a4');

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
    src[sym00][sym10][sym20] = 1;

    var ret = pickDeep(src, [[sym00], [sym01]]);
    expect(ret).not.to.equal(src);
    expect(ret[sym00]).to.equal(src[sym00]);
    expect(Object.getOwnPropertySymbols(ret)).to.deep.equal([sym00]);

    ret = pickDeep(src[sym00], [[sym10], [sym11]]);
    expect(ret).not.to.equal(src[sym00]);
    expect(ret[sym10]).not.to.equal(src[sym00][sym10]);
    expect(ret[sym10][sym20]).to.equal(src[sym00][sym10][sym20]);
    expect(ret[sym10][sym20]).to.equal(1);
    expect(Object.getOwnPropertySymbols(ret)).to.deep.equal([sym10]);

    ret = pickDeep(src, [[sym00, sym10], [sym00, sym11]]);
    expect(ret[sym00]).not.to.equal(src[sym00]);
    expect(ret[sym00][sym10]).not.to.equal(src[sym00][sym10]);
    expect(ret[sym00][sym10][sym20]).to.equal(src[sym00][sym10][sym20]);
    expect(ret[sym00][sym10][sym20]).to.equal(1);
    expect(Object.getOwnPropertySymbols(ret[sym00])).to.deep.equal([sym10]);
  });

  it('Should return an empty plain object when first arg is not a object',
  function() {
    var srcs = [
      undefined,
      null,
      true,
      false,
      0,
      123,
      function() {},
    ];

    if (typeof Symbol === 'function') {
      srcs.push(Symbol('abc'));
    }

    srcs.forEach(function(src) {
      var ret = pickDeep(src, [['length']]);
      expect(ret).to.deep.equal({});
      expect(Object.getOwnPropertyNames(ret)).to.deep.equal([]);
      if (typeof Symbol === 'function') {
        expect(Object.getOwnPropertySymbols(ret)).to.deep.equal([]);
      }
    });
  });

  it('Should return a plain object of which props are index strings' +
  '\n\twhen 1st arg is a string', function() {
    expect(pickDeep('', [[0], [2]])).to.deep.equal({});
    expect(pickDeep('abc', [[0], [2]])).to.deep.equal({ 0: 'a', 2: 'c' });
  });

  it('Should return a plain object of which props are index strings' +
  '\n\twhen 1st arg is an array', function() {
    expect(pickDeep([], [[0], [2]])).deep.equal({});
    expect(pickDeep(['a', 'b', 'c'], [[0], [2]])).deep.equal(
      { 0: 'a', 2: 'c' });
  });

  it('Should return a plain object of which props are attached' +
  '\n\twhen 1st arg is a function', function() {
    expect(pickDeep(function() {}, [['a'], ['b']])).to.deep.equal({});

    var fn = function() {};
    fn.a = 'A';
    fn.b = { c: 'C' };
    var ret = pickDeep(fn, [['a'], ['b']]);
    expect(ret).to.deep.equal({ a: 'A', b: { c: 'C' } });
    expect(ret.b).to.not.equal(fn.b);
  });

  it('Should return an empty object when 2nd arg is not an array', function() {
    var obj = { a: 'A', b: { c: 'C', d: 'D' } };
    expect(pickDeep(obj, undefined)).to.deep.equal({});
    expect(pickDeep(obj, null)).to.deep.equal({});
    expect(pickDeep(obj, true)).to.deep.equal({});
    expect(pickDeep(obj, false)).to.deep.equal({});
    expect(pickDeep(obj, 0)).to.deep.equal({});
    expect(pickDeep(obj, 123)).to.deep.equal({});
    expect(pickDeep(obj, '')).to.deep.equal({});
    expect(pickDeep(obj, 'a')).to.deep.equal({});
    expect(pickDeep(obj, {})).to.deep.equal({});
    expect(pickDeep(obj, { a: 1, b: 2 })).to.deep.equal({});
    expect(pickDeep(obj, function a() {})).to.deep.equal({});

    if (typeof Symbol === 'function') {
      expect(pickDeep(obj, Symbol('a'))).to.deep.equal({});
    }
  });

  it('Should ignore when props are arrays of Symbols', function() {
    if (typeof Symbol !== 'function') {
      this.skip();
      return;
    }

    var a = Symbol('a'), b = Symbol('b');
    var ab = a.toString() + ',' + b.toString();
    var obj = {};
    obj[a] = {};
    obj[a][b] = 123;
    obj[ab] = 456;

    var ret = pickDeep(obj, [[[a,b]]]);
    expect(ret[a]).to.equal(undefined);
    expect(ret[ab]).to.equal(undefined);
  });

  it('Should not allow to use an array as a property', function() {
    var obj = { a: { 'b,c': 1, d: 2 } };
    var ret = pickDeep(obj, [['a', ['b', 'c']], ['a', 'd']]);
    expect(ret).to.deep.equal({ a: { d: 2 } });

    ret = pickDeep(obj, [['a', 'b,c'], ['a', ['d']]]);
    expect(ret).to.deep.equal({ a: { 'b,c': 1 } });

    ret = pickDeep(obj, [[['a'], 'b,c'], [['a'], 'd']]);
    expect(ret).to.deep.equal({});
  });

  [100, 500, 1000].forEach(function(num) {
    it('Should pick normally when count of propPaths (2nd arguent) ' +
    'is a log\n\t(' + num + 'x' + num + ')', function() {
      this.timeout(0);

      var obj = {};
      for (var i = 0; i < num; i++) {
        var child = {};
        for (var j = 0; j < num; j++) {
          child['b' + j] = 'A' + i + 'B' + j;
        }
        obj['a' + i] = child;
      }

      var expected = {};
      var pickedKeys = [];
      visit(obj, function(key, value, index, count, parentKeys) {
        switch (parentKeys.length) {
          case 0: {
            expected[key] = {};
            break;
          }
          case 1: {
            var keyPath = parentKeys.concat(key);
            pickedKeys.push(keyPath);
            setDeep(expected, keyPath, value);
            break;
          }
        }
      });
      expect(pickDeep(obj, pickedKeys)).to.deep.equal(expected);
    });
  });
});

})();
(function(){
'use strict';


var expect = chai.expect;



var pick = fav.prop.pick;

describe('fav.prop.pick', function() {

  it('Should return a new plain object which is copied specified prop keys' +
  '\n\tfrom source object', function() {
    var src = { a: 1, b: 2, c: 3 };
    expect(pick(src, [])).to.deep.equal({});
    expect(pick(src, ['c'])).to.deep.equal({ c: 3 });
    expect(pick(src, ['c', 'a'])).to.deep.equal({ a: 1, c: 3 });
    expect(pick(src, ['c', 'a', 'b'])).to.deep.equal({ a: 1, b: 2, c: 3 });
  });

  it('Should return a new plain object which is copied specified prop ' +
  '\n\tsymbols from source object', function() {
    if (typeof Symbol !== 'function') {
      this.skip();
      return;
    }
    var a = Symbol('a');
    var b = Symbol('b');
    var c = Symbol('c');

    var src = {};
    src[a] = 1;
    src[b] = 2;
    src[c] = 3;

    expect(Object.getOwnPropertySymbols(pick(src, []))).to.has.members([]);

    var ret = pick(src, [c]);
    expect(Object.getOwnPropertySymbols(ret)).to.has.members([c]);
    expect(ret[c]).to.equal(3);

    ret = pick(src, [c, a]);
    expect(Object.getOwnPropertySymbols(ret)).to.has.members([a, c]);
    expect(ret[a]).to.equal(1);
    expect(ret[c]).to.equal(3);

    ret = pick(src, [c, a, b]);
    expect(Object.getOwnPropertySymbols(ret)).to.has.members([a, b, c]);
    expect(ret[a]).to.equal(1);
    expect(ret[b]).to.equal(2);
    expect(ret[c]).to.equal(3);
  });

  it('Should not return unenumerable prop keys', function() {
    var obj = {};
    Object.defineProperties(obj, {
      a: { value: 1 },
      b: { enumerable: true, value: 2 },
      c: { value: 3 },
    });
    expect(pick(obj, ['a', 'b', 'c'])).to.deep.equal({ b: 2 });
  });

  it('Should not return unenumerable prop symbols', function() {
    if (typeof Symbol !== 'function') {
      this.skip();
      return;
    }
    var a = Symbol('a');
    var b = Symbol('b');
    var c = Symbol('c');

    var obj = {};
    obj[a] = 1;
    Object.defineProperty(obj, b, { value: 2 });
    Object.defineProperty(obj, c, { enumerable: true, value: 3 });

    var ret = pick(obj, [a, b, c]);
    expect(Object.getOwnPropertySymbols(ret)).to.has.members([a, c]);
    expect(ret[a]).to.equal(1);
    expect(ret[c]).to.equal(3);
  });

  it('Should not return inherited prop keys', function() {
    function Fn1() {
      this.a = 1;
      this.b = 2;
    }
    function Fn2() {
      this.c = 3;
    }
    Fn1.prototype = new Fn2();
    var obj = new Fn1();

    var ret = pick(obj, ['a', 'b', 'c']);
    expect(ret).to.deep.equal({ a: 1, b: 2 });
  });

  it('Should not return inherited prop symbols', function() {
    if (typeof Symbol !== 'function') {
      this.skip();
      return;
    }
    var a = Symbol('a');
    var b = Symbol('b');
    var c = Symbol('c');

    function Fn1() {
      this[a] = 1;
      this[b] = 2;
    }
    function Fn2() {
      this[c] = 3;
    }
    Fn1.prototype = new Fn2();
    var obj = new Fn1();

    var ret = pick(obj, [a, b, c]);
    expect(Object.getOwnPropertySymbols(ret)).to.has.members([a, b]);
    expect(ret[a]).to.equal(1);
    expect(ret[b]).to.equal(2);
  });

  it('Should return an empty plain object when first arg is not a object',
  function() {
    expect(pick(undefined, ['a'])).to.deep.equal({});
    expect(pick(null, ['a'])).to.deep.equal({});
    expect(pick(true, ['a'])).to.deep.equal({});
    expect(pick(false, ['a'])).to.deep.equal({});
    expect(pick(0, ['a'])).to.deep.equal({});
    expect(pick(123, ['a'])).to.deep.equal({});

    if (typeof Symbol === 'function') {
      expect(pick(Symbol('foo'), ['a'])).to.deep.equal({});
    }

    // string and array are exceptions
    expect(pick('', ['length'])).to.deep.equal({});
    expect(pick('ABC', ['0'])).to.deep.equal({ '0': 'A' });
    expect(pick([], ['length'])).to.deep.equal({});
    expect(pick([1, 2, 3], ['0'])).to.deep.equal({ '0': 1 });

    // function can have enum props
    var fn = function() {};
    expect(pick(fn, ['name'])).to.deep.equal({});
    fn.a = 1;
    expect(pick(fn, ['a'])).to.deep.equal({ a: 1 });
  });

  it('Should return an empty plain object when second arg is not an array',
  function() {
    var src = { a: 1, b: 2, c: 3 };
    expect(pick(src, undefined)).to.deep.equal({});
    expect(pick(src, null)).to.deep.equal({});
    expect(pick(src, true)).to.deep.equal({});
    expect(pick(src, false)).to.deep.equal({});
    expect(pick(src, 0)).to.deep.equal({});
    expect(pick(src, 123)).to.deep.equal({});
    expect(pick(src, '')).to.deep.equal({});
    expect(pick(src, 'a')).to.deep.equal({});
    expect(pick(src, {})).to.deep.equal({});
    expect(pick(src, { a: 'b' })).to.deep.equal({});
    expect(pick(src, function() {})).to.deep.equal({});

    if (typeof Symbol === 'function') {
      expect(pick(src, Symbol('a'))).to.deep.equal({});
    }
  });

  it('Should pick normally when length of second argument is a lot',
  function() {
    var src = {};
    for (var i = 0; i < 10000; i++) {
      src['a' + i] = i;
    }
    var keys = Object.keys(src).reverse();
    for (var j = 0; j < 100; j++) {
      keys.push('b' + j);
    }
    expect(pick(src, keys)).to.deep.equal(src);
  });

  it('Should not throw an error when 2nd arg contains a Symbol array',
  function() {
    if (typeof Symbol !== 'function') {
      this.skip();
      return;
    }

    var a = Symbol('a'), b = Symbol('b'), c = Symbol('c');
    var obj = {};
    obj[a] = 123;
    obj[b] = 456;
    obj[c] = 789;

    expect(Object.getOwnPropertySymbols(pick(obj, [[a]]))).to.has.members([]);
    expect(Object.getOwnPropertySymbols(pick(obj, [[a]]))).to.has.members([]);

    var props = [];
    for (var i = 0; i < 110; i++) {
      props.push(String(i));
    }
    props[40] = a;
    props[50] = [b];
    props[60] = c;
    expect(Object.getOwnPropertySymbols(pick(obj, props))).to.has.members(
      [a, c]);
  });

  it('Should not allow to use an array as a property', function() {
    var obj = {};
    obj.a = 123;
    obj['b,c'] = 456;
    expect(obj['a']).to.equal(123);
    expect(obj['b,c']).to.equal(456);
    expect(obj[['a']]).to.equal(123);
    expect(obj[['b','c']]).to.equal(456);
    expect(obj['b,c']).to.equal(456);

    var ret1 = { a: 123 };
    var ret2 = {};
    ret2['b,c'] = 456;
    expect(pick(obj, ['a'])).to.deep.equal(ret1);
    expect(pick(obj, ['b,c'])).to.deep.equal(ret2);
    expect(pick(obj, [['a']])).to.deep.equal({});
    expect(pick(obj, [['b'],['c']])).to.deep.equal({});

    expect(pick(obj, ['a', 'b,c'])).to.deep.equal(obj);
    expect(pick(obj, [['a'], 'b,c'])).to.deep.equal(ret2);
    expect(pick(obj, ['a', ['b','c']])).to.deep.equal(ret1);
    expect(pick(obj, [['a'], ['b','c']])).to.deep.equal({});
  });
});

})();
(function(){
'use strict';

/* eslint brace-style: off */


var expect = chai.expect;



var setDeep = fav.prop.setDeep;

describe('fav.prop.set-deep', function() {

  it('Should set value of the specified prop path', function() {
    var obj = {
      a00: {
        a10: { a20: 1, a21: 2, a22: 3 },
        a11: { a20: 4, a21: 5, a22: 6 },
      },
    };

    setDeep(obj, ['a00', 'a10', 'a20'], 10);
    expect(obj.a00.a10.a20).to.equal(10);

    setDeep(obj, ['a00', 'a10', 'a21'], 20);
    expect(obj.a00.a10.a21).to.equal(20);

    setDeep(obj, ['a00', 'a10', 'a22'], 30);
    expect(obj.a00.a10.a22).to.equal(30);

    setDeep(obj, ['a00', 'a10'], 100);
    expect(obj.a00.a10).to.equal(100);

    setDeep(obj, ['a00', 'a11'], 110);
    expect(obj.a00.a11).to.equal(110);

    setDeep(obj, ['a00'], 999);
    expect(obj.a00).to.equal(999);
  });

  it('Should create a property and set its value when the prop does not exist',
  function() {
    var obj = {
      a00: {
        a10: { a20: 1, a21: 2, a22: 3 },
        a11: { a20: 4, a21: 5, a22: 6 },
      },
      a01: {
        a10: { a20: 7, a21: 8, a22: 9 },
        a11: {},
      },
    };

    setDeep(obj, ['a01', 'a11', 'a22'], 'A');
    expect(obj.a01.a11.a22).to.equal('A');

    setDeep(obj, ['a02'], 'B');
    expect(obj.a02).to.equal('B');

    setDeep(obj, ['a', 'b', 'c', 'd', 'e'], 'C');
    expect(obj.a.b.c.d.e).to.equal('C');
  });

  it('Should do nothing when obj is primitive type', function() {
    var v = undefined;
    setDeep(v, ['length'], 123);
    expect(v).to.deep.equal(undefined);

    v = null;
    setDeep(v, ['length'], 123);
    expect(v).to.deep.equal(null);

    v = true;
    setDeep(v, ['length'], 123);
    expect(v).to.deep.equal(true);
    expect(v.length).to.equal(undefined);

    v = false;
    setDeep(v, ['length'], 123);
    expect(v).to.deep.equal(false);
    expect(v.length).to.equal(undefined);

    v = 0;
    setDeep(v, ['length'], 12333);
    expect(v).to.deep.equal(0);
    expect(v.length).to.equal(undefined);

    v = 999;
    setDeep(v, ['length'], 123);
    expect(v).to.deep.equal(999);
    expect(v.length).to.equal(undefined);

    if (typeof Symbol === 'function') {
      v = Symbol('v');
      setDeep(v, ['length'], 123);
      expect(v).to.deep.equal(v);
      expect(v.length).to.equal(undefined);
    }
  });

  it('Should set prop value when obj is not a plain object', function() {
    var obj = new Boolean(true);
    setDeep(obj, ['a', 'b', 'c'], 123);
    expect(obj.a.b.c).to.equal(123);

    obj = new Boolean(false);
    setDeep(obj, ['a', 'b', 'c'], 456);
    expect(obj.a.b.c).to.equal(456);

    obj = new Number(0);
    setDeep(obj, ['a', 'b', 'c'], 789);
    expect(obj.a.b.c).to.equal(789);

    obj = new Number(123);
    setDeep(obj, ['a', 'b', 'c'], 'abc');
    expect(obj.a.b.c).to.equal('abc');

    obj = new String('AAA');
    setDeep(obj, ['a', 'b', 'c'], 'def');
    expect(obj.a.b.c).to.equal('def');

    obj = [];
    setDeep(obj, ['a', 'b', 'c'], 'ghi');
    expect(obj.a.b.c).to.equal('ghi');

    obj = {};
    setDeep(obj, ['a', 'b', 'c'], 'jkl');
    expect(obj.a.b.c).to.equal('jkl');

    obj = function() {};
    setDeep(obj, ['a', 'b', 'c'], 'mno');
    expect(obj.a.b.c).to.equal('mno');

    obj = new Date();
    setDeep(obj, ['a', 'b', 'c'], 'pqr');
    expect(obj.a.b.c).to.equal('pqr');
  });

  it('Should set a value to enumerable property key', function() {
    var obj = { a: { b: { c: 123 } } };
    setDeep(obj, ['a', 'b', 'c'], 111);
    expect(obj.a.b.c).to.equal(111);
  });

  it('Should set a value to unenumerable property key', function() {
    var obj = {};
    Object.defineProperty(obj, 'a', { writable: true, value: {} });
    Object.defineProperty(obj.a, 'b', { writable: true, value: {} });
    Object.defineProperty(obj.a.b, 'c', { writable: true, value: 123 });
    setDeep(obj, ['a', 'b', 'c'], 222);
    expect(obj.a.b.c).to.equal(222);
  });

  it('Should not throw an error when property is read only', function() {
    var obj = {};
    Object.defineProperty(obj, 'a', { value: {} });
    Object.defineProperty(obj.a, 'b', { value: {} });
    Object.defineProperty(obj.a.b, 'c', { value: 123 });
    setDeep(obj, ['a', 'b', 'c'], 222);
    expect(obj.a.b.c).to.equal(123);

    Object.defineProperty(obj.a, 'b2', { value: 123 });
    setDeep(obj, ['a', 'b2', 'c2'], 222);
    expect(obj.a.b2).to.equal(123);
    expect(obj.a.b2.c2).to.equal(undefined);
  });

  it('Should set a value to inherited property key', function() {
    var obj0 = new function() {
      this.a = {};
    };
    Object.defineProperty(obj0.a, 'b', { value: {} });

    obj0.a.b.c = 123;
    function Fn1() {};
    Fn1.prototype = obj0;
    var obj = new Fn1();
    expect(obj.a.b.c).to.equal(123);

    setDeep(obj, ['a', 'b', 'c'], 987);
    expect(obj.a.b.c).to.equal(987);
  });

  it('Should set a value to enumerable property symbol', function() {
    if (typeof Symbol !== 'function') {
      this.skip();
      return;
    }
    var a = Symbol('a'), b = Symbol('b'), c = Symbol('c');

    var obj = {};
    obj[a] = {};
    obj[a][b] = {};
    obj[a][b][c] = 1;

    setDeep(obj, [a, b, c], 2);
    expect(obj[a][b][c], 2);
  });

  it('Should set a value to unenumerable property key', function() {
    if (typeof Symbol !== 'function') {
      this.skip();
      return;
    }
    var a = Symbol('a'), b = Symbol('b'), c = Symbol('c');

    var obj = {};
    Object.defineProperty(obj, a, { value: {} });
    Object.defineProperty(obj[a], b, { value: {} });
    Object.defineProperty(obj[a][b], c, { writable: true, value: 1 });

    setDeep(obj, [a, b, c], 2);
    expect(obj[a][b][c]).to.equal(2);
  });

  it('Should not throw an error when property is read only', function() {
    if (typeof Symbol !== 'function') {
      this.skip();
      return;
    }
    var a = Symbol('a'), b = Symbol('b'), c = Symbol('c');

    var obj = {};
    Object.defineProperty(obj, a, { value: {} });
    Object.defineProperty(obj[a], b, { value: {} });
    Object.defineProperty(obj[a][b], c, { value: 1 });

    setDeep(obj, [a, b, c], 2);
    expect(obj[a][b][c]).to.equal(1);
  });

  it('Should set a value to inherited property key', function() {
    if (typeof Symbol !== 'function') {
      this.skip();
      return;
    }
    var a = Symbol('a'), b = Symbol('b'), c = Symbol('c');

    var obj0 = new function() {
      this[a] = {};
    };
    Object.defineProperty(obj0[a], b, { value: {} });

    obj0[a][b][c] = 123;
    function Fn1() {};
    Fn1.prototype = obj0;
    var obj = new Fn1();
    expect(obj[a][b][c]).to.equal(123);

    setDeep(obj, [a, b, c], 987);
    expect(obj[a][b][c]).to.equal(987);
  });

  it('Should do nothing when all arguments is not specified', function() {
    var obj = {};
    setDeep(obj, ['a', 'b']);
    expect(obj).to.deep.equal({});

    setDeep(obj);
    expect(obj).to.deep.equal({});
  });

  it('Should not throw an error when 2nd arg is a Symbol array', function() {
    if (typeof Symbol !== 'function') {
      this.skip();
      return;
    }

    var a = Symbol('a'), b = Symbol('b'), c = Symbol('c');
    var obj = {};
    obj[a] = {};
    obj[a][b] = {};
    obj[a][b][c] = 123;

    setDeep(obj, [[a], b, c], 123);
    expect(obj[a][b][c]).to.equal(123);

    setDeep(obj, [a, [b], c], 123);
    expect(obj[a][b][c]).to.equal(123);

    setDeep(obj, [a, b, [c]], 123);
    expect(obj[a][b][c]).to.equal(123);
  });

  it('Should not append/modify source object when failed', function() {
    if (typeof Symbol !== 'function') {
      this.skip();
      return;
    }

    var s = Symbol('s');
    var obj = { p: {} };

    setDeep(obj, ['p', [s], 'b', 'c'], 123);
    expect(obj.p.s).to.equal(undefined);
    expect(obj).to.deep.equal({ p: {} });
    expect(Object.getOwnPropertyNames(obj.p).length).to.equal(0);
    expect(Object.getOwnPropertySymbols(obj.p).length).to.equal(0);

    setDeep(obj, ['p', 'a', [s], 'c'], 123);
    expect(obj).to.deep.equal({ p: {} });
    expect(obj.p.a).to.equal(undefined);
    expect(Object.getOwnPropertyNames(obj.p).length).to.equal(0);
    expect(Object.getOwnPropertySymbols(obj.p).length).to.equal(0);

    setDeep(obj, ['p', 'a', 'b', [s]], 123);
    expect(obj).to.deep.equal({ p: {} });
    expect(obj.p.a).to.equal(undefined);
    expect(Object.getOwnPropertyNames(obj.p).length).to.equal(0);
    expect(Object.getOwnPropertySymbols(obj.p).length).to.equal(0);
  });

  it('Should not set a value prop path is not an array', function() {
    var obj = {};
    setDeep(obj, undefined, 123);
    expect(obj).to.deep.equal({});

    setDeep(obj, null, 123);
    expect(obj).to.deep.equal({});

    setDeep(obj, true, 123);
    expect(obj).to.deep.equal({});

    setDeep(obj, false, 123);
    expect(obj).to.deep.equal({});

    setDeep(obj, 0, 123);
    expect(obj).to.deep.equal({});

    setDeep(obj, 123, 123);
    expect(obj).to.deep.equal({});

    setDeep(obj, '', 123);
    expect(obj).to.deep.equal({});

    setDeep(obj, 'abc', 123);
    expect(obj).to.deep.equal({});

    setDeep(obj, {}, 123);
    expect(obj).to.deep.equal({});

    setDeep(obj, { a: 1 }, 123);
    expect(obj).to.deep.equal({});

    setDeep(obj, function() {}, 123);
    expect(obj).to.deep.equal({});

    if (typeof Symbol === 'function') {
      var a = Symbol('a');
      setDeep(obj, a, 123);
      expect(obj).to.deep.equal({});
      expect(obj[a]).to.deep.equal(undefined);
    }

    var d = new Date();
    setDeep(obj, d, 123);
    expect(obj).to.deep.equal({});
  });

  it('Should not allow to use an array as a property', function() {
    var obj = { a: 1, b: { c: 2 }, 'd,e': 3 };
    setDeep(obj, ['a'], 10);
    expect(obj.a).to.equal(10);
    setDeep(obj, [['a']], 100);
    expect(obj.a).to.equal(10);

    setDeep(obj, ['b', 'c'], 20);
    expect(obj.b.c).to.equal(20);
    setDeep(obj, [['b'], 'c'], 200);
    expect(obj.b.c).to.equal(20);
    setDeep(obj, ['b', ['c']], 200);
    expect(obj.b.c).to.equal(20);

    setDeep(obj, ['d,e'], 30);
    expect(obj['d,e']).to.equal(30);
    setDeep(obj, [['d','e']], 30);
    expect(obj['d,e']).to.equal(30);

    if (typeof Symbol === 'function') {
      obj = {};
      var a = Symbol('a'), b = Symbol('b'), c = Symbol('c'),
          d = Symbol('d'), e = Symbol('e');
      var de = [d.toString(), e.toString()].toString();
      obj[a] = 1;
      obj[a.toString()] = 11;
      obj[b] = {};
      obj[b][c] = 2;
      obj[b][c.toString()] = 21;
      obj[b.toString()] = {};
      obj[b.toString()][c] = 22;
      obj[de] = 3;

      setDeep(obj, [a], 10);
      expect(obj[a]).to.equal(10);
      expect(obj[a.toString()]).to.equal(11);
      setDeep(obj, [[a]], 100);
      expect(obj[a]).to.equal(10);
      expect(obj[a.toString()]).to.equal(11);

      setDeep(obj, [b, c], 20);
      expect(obj[b][c]).to.equal(20);
      expect(obj[b][c.toString()]).to.equal(21);
      expect(obj[b.toString()][c]).to.equal(22);
      setDeep(obj, [[b], c], 200);
      expect(obj[b][c]).to.equal(20);
      expect(obj[b][c.toString()]).to.equal(21);
      expect(obj[b.toString()][c]).to.equal(22);
      setDeep(obj, [b, [c]], 200);
      expect(obj[b][c]).to.equal(20);
      expect(obj[b][c.toString()]).to.equal(21);
      expect(obj[b.toString()][c]).to.equal(22);

      setDeep(obj, [de], 30);
      expect(obj[de]).to.equal(30);
      setDeep(obj, [[d, e]], 300);
      expect(obj[de]).to.equal(30);
    }
  });
});

})();
(function(){
'use strict';


var expect = chai.expect;



var visit = fav.prop.visit;
var isPlainObject = fav.type.isPlainObject;

var logs = [];

function logger(key, value, index, count, parentKeys, parentNode) {
  logs.push([key, value, index, count, parentKeys, parentNode]);
}

describe('fav.prop.visit', function () {

  beforeEach(function() {
    logs = [];
  });

  it('Should visit all nodes in a plain object tree - empty', function() {
    var obj = {};
    visit(obj, logger);
    expect(logs).to.deep.equal([]);
  });

  it('Should visit all key props in a plain object tree - depth=1',
  function() {
    var obj = { a: 1, b: true, c: 'abc' };
    visit(obj, logger);
    expect(logs).to.deep.equal([
      ['a', 1, 0, 3, [], obj],
      ['b', true, 1, 3, [], obj],
      ['c', 'abc', 2, 3, [], obj],
    ]);
  });

  it('Should visit all symbol props in a plain object tree - depth=1',
  function() {
    if (typeof Symbol !== 'function') {
      this.skip();
      return;
    }

    var a = Symbol('a');
    var b = Symbol('b');
    var c = Symbol('c');

    var obj = {};
    obj[a] = 1;
    obj[b] = true;
    obj[c] = 'abc';

    visit(obj, logger);
    expect(logs).to.deep.equal([
      [a, 1, 0, 3, [], obj],
      [b, true, 1, 3, [], obj],
      [c, 'abc', 2, 3, [], obj],
    ]);
  });

  it('Should visit all key props in a plain object tree - depth>=2',
  function() {
    var obj = { a: 1, b: { c: true, d: { e: 'abc' } } };
    visit(obj, logger);
    expect(logs).to.deep.equal([
      ['a', 1, 0, 2, [], obj],
      ['b', { c: true, d: { e: 'abc' } }, 1, 2, [], obj],
      ['c', true, 0, 2, ['b'], obj.b],
      ['d', { e: 'abc' }, 1, 2, ['b'], obj.b],
      ['e', 'abc', 0, 1, ['b', 'd'], obj.b.d],
    ]);
  });

  it('Should visit all symbol props in a plain object tree - depth>=2',
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

    var obj = {};
    obj[a] = 1;
    obj[b] = {};
    obj[b][c] = true;
    obj[b][d] = {};
    obj[b][d][e] = 'abc';

    visit(obj, logger);
    expect(logs).to.deep.equal([
      [a, 1, 0, 2, [], obj],
      [b, {}, 1, 2, [], obj],
      [c, true, 0, 2, [b], obj[b]],
      [d, {}, 1, 2, [b], obj[b]],
      [e, 'abc', 0, 1, [b, d], obj[b][d]],
    ]);
    expect(logs[1][1][c]).to.equal(true);
    expect(logs[1][1][d][e]).to.equal('abc');
    expect(logs[3][1][e]).to.equal('abc');
  });

  it('Should not visit properties which are not plain objects', function() {
    var fn = function f() {};
    var obj = { a: [1, 2], b: { c: new Date(0) }, d: fn };
    visit(obj, logger);
    expect(logs).to.deep.equal([
      ['a', [1, 2], 0, 3, [], obj],
      ['b', { c: new Date(0) }, 1, 3, [], obj],
      ['c', new Date(0), 0, 1, ['b'], obj.b],
      ['d', fn, 2, 3, [], obj],
    ]);
  });

  it('Should do nothing when argument is not a plain object', function() {
    visit(undefined, logger);
    expect(logs.length).to.equal(0);

    visit(null, logger);
    expect(logs.length).to.equal(0);

    visit(true, logger);
    expect(logs.length).to.equal(0);

    visit(false, logger);
    expect(logs.length).to.equal(0);

    visit(0, logger);
    expect(logs.length).to.equal(0);

    visit(123, logger);
    expect(logs.length).to.equal(0);

    visit('', logger);
    expect(logs.length).to.equal(0);

    visit('ABC', logger);
    expect(logs.length).to.equal(0);

    visit([], logger);
    expect(logs.length).to.equal(0);

    visit([1, 2, 3], logger);
    expect(logs.length).to.equal(0);

    visit(function ff() {}, logger);
    expect(logs.length).to.equal(0);

    visit(new Date(), logger);
    expect(logs.length).to.equal(0);
  });

  it('Should do nothing when second argument is not a function', function() {
    var obj = { a: 1, b: true, c: 'abc' };
    visit(obj);
    visit(obj, undefined);
    visit(obj, null);
    visit(obj, true);
    visit(obj, false);
    visit(obj, 0);
    visit(obj, 123);
    visit(obj, '');
    visit(obj, 'abc');
    visit(obj, []);
    visit(obj, [1, 2, 3]);
    visit(obj, {});
    visit(obj, { a: 1, b: 'B' });
    visit(obj, new Date());

    if (typeof Symbol === 'function') {
      visit(obj, Symbol('foo'));
    }
  });

  it('Should not visit properties of which values are symbols', function() {
    if (typeof Symbol !== 'function') {
      this.skip();
      return;
    }

    var foo = Symbol('foo'), bar = Symbol('bar');
    var obj = { a: foo, b: { c: bar } };
    visit(obj, logger);
    expect(logs).to.deep.equal([
      ['a', foo, 0, 2, [], obj],
      ['b', { c: bar }, 1, 2, [], obj],
      ['c', bar, 0, 1, ['b'], obj.b],
    ]);
  });

  it('Should do nothing when argument is not a symbol', function() {
    if (typeof Symbol !== 'function') {
      this.skip();
      return;
    }

    visit(Symbol('foo'), logger);
    expect(logs.length).to.equal(0);
  });

  it('Should stop digging when 2nd argument function return true', function() {
    var src = { a: { b: { c: { d: 123 }, e: { f: 'FFF' } } } };
    visit(src, function(key, value, index, count, parentKeys) {
      logs.push([key, parentKeys]);
      return (parentKeys.length >= 2);
    });

    expect(logs).to.deep.equal([
      ['a', []],
      ['b', ['a']],
      ['c', ['a', 'b']],
      ['e', ['a', 'b']],
    ]);
  });

  it('Should update property values using parentNode', function() {
    var src = { a: { b: { c: { d: 123 }, e: { f: 456 } } } };
    visit(src, function(key, value, index, count, parentKeys, parentNode) {
      if (!isPlainObject(value)) {
        parentNode[key] = value * 2;
      }
    });
    expect(src).to.deep.equal({ a: { b: { c: { d: 246 }, e: { f: 912 } } } });
  });
});

})();
(function(){
'use strict';

function isPhantomJs() {
  if (typeof xslet !== 'undefined' && typeof xslet.platform !== 'undefined') {
    var ua = xslet.platform.ua;
    if (ua.PHANTOMJS) {
      return true;
    }
  }
  return false;
}

if (typeof window !== 'undefined') {
  window.isPhantomJs = isPhantomJs;
} else if (typeof module !== 'undefined') {
  module.exports.isPhantomJs = isPhantomJs;
}

})();
