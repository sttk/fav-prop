'use strict';

var chai = require('chai');
var expect = chai.expect;

var fav = {}; fav.prop = require('..');

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
