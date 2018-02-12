'use strict';

var chai = require('chai');
var expect = chai.expect;
var fav = {}; fav.prop = require('..');
fav.type = {}; fav.type.isPlainObject = require('@fav/type.is-plain-object');

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
