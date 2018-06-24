'use strict';

var chai = require('chai');
var expect = chai.expect;

var fav = {}; fav.prop = require('..');



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
