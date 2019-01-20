'use strict';

var chai = require('chai');
var expect = chai.expect;

var fav = {}; fav.prop = require('..');

var define = fav.prop.define;

describe('fav.prop.define', function() {

  it('Should define immutable', function() {
    var obj = {};
    define.immutable(obj, 'a', 1);
    expect(obj.a).to.equal(1);

    expect(function() {
      obj.a = 2;
    }).to.throws(TypeError);
    expect(obj.a).to.equal(1);
  });

  it('Should define mutable', function() {
    var obj = {};
    define.mutable(obj, 'a', 1);
    expect(obj.a).to.equal(1);

    obj.a = 2;
    expect(obj.a).to.equal(2);
  });

  describe('Define override', function() {
    it('Should override when specifying a name and a function', function() {
      var logs = [];
      var obj = { a: 123 };
      define.override(obj, 'f', function f1(b) {
        logs.push('f: a=' + this.a + ', b=' + b);
      });
      obj.f(456);
      expect(logs).to.deep.equal(['f: a=123, b=456']);

      define.override(obj, 'f', function f2(b) {
        f2.$uper(789);
        logs.push('f (overridden): a=' + this.a + ', b=' + b);
      });
      obj.f('ABC');
      expect(logs).to.deep.equal([
        'f: a=123, b=456',
        'f: a=123, b=789',
        'f (overridden): a=123, b=ABC',
      ]);
    });

    it('Should override when specifying a named function', function() {
      var logs = [];
      var obj = { a: 123 };
      obj.f = function(b) {
        logs.push('f: a=' + this.a + ', b=' + b);
      };
      obj.f(456);
      expect(logs).to.deep.equal(['f: a=123, b=456']);

      define.override(obj, function f(b) {
        f.$uper(789);
        logs.push('f (overridden): a=' + this.a + ', b=' + b);
      });
      obj.f('ABC');
      expect(logs).to.deep.equal([
        'f: a=123, b=456',
        'f: a=123, b=789',
        'f (overridden): a=123, b=ABC',
      ]);

      define.override(obj, function f(b) {
        f.$uper('CDE');
        logs.push('f (overridden 2): a=' + this.a + ', b=' + b);
      });
      obj.f('FGH');
      expect(logs).to.deep.equal([
        'f: a=123, b=456',
        'f: a=123, b=789',
        'f (overridden): a=123, b=ABC',
        'f: a=123, b=789',
        'f (overridden): a=123, b=CDE',
        'f (overridden 2): a=123, b=FGH',
      ]);
    });

    it('Should ignore when specifying a no-name func as 2nd arg', function() {
      var logs = [];
      var obj = { a: 123 };
      obj.f = function(b) {
        logs.push('f: a=' + this.a + ', b=' + b);
      };
      obj.f(456);
      expect(logs).to.deep.equal(['f: a=123, b=456']);

      define.override(obj, function(b) {
        logs.push('f (overridden): a=' + this.a + ', b=' + b);
      });
      obj.f('ABC');
      expect(logs).to.deep.equal([
        'f: a=123, b=456',
        'f: a=123, b=ABC',
      ]);

      define.override(obj, function(b) {
        f.$uper('CDE');
        logs.push('f (overridden 2): a=' + this.a + ', b=' + b);
      });
      obj.f('FGH');
      expect(logs).to.deep.equal([
        'f: a=123, b=456',
        'f: a=123, b=ABC',
        'f: a=123, b=FGH',
      ]);
    });
  });
});
