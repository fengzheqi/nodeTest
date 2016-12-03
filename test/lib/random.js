/**
 * @file
 * @author tommyzqfeng
 * @date 2016/12/3
 */
var random = require('../../lib/random');
var assert = require('assert');

describe('lib.random', function () {
  describe('digits()', function () {
    it('should returns fixed length of string', function () {
      var expect = 10;
      var actual = random.digits(expect);
      assert.equal(expect, actual.length);
    });
    it('should catch an error with undefined value', function () {
      assert.throws(function () {
        random.digits()
      }, Error)
    });
    it('should catch an error with boolean', function () {
      assert.throws(function () {
        random.digits(false)
      }, Error);
    })
  })
});