'use strict';

var chai = require('chai');
var expect = chai.expect;

var fav = {}; fav.prop = require('..');

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
