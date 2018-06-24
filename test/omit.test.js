'use strict';

var chai = require('chai');
var expect = chai.expect;

var fav = {}; fav.prop = require('..');
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
