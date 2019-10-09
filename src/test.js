const { partial } = require("./index");
const { expect } = require("chai");
const sinon = require("sinon");

describe("tiny-partial", () => {
  it("should default the number of intermediate functions to the arity of the function if no second parameter is passed", () => {
    const fn = sinon.spy(function(a, b) {});
    const partialFn = partial(fn);
    expect(fn.called).to.be.false;
    const intermediateFn = partialFn();
    expect(fn.called).to.be.false;
    intermediateFn();
    expect(fn.called).to.be.true;
  });
  it("should return the value of the function with the currently gathered arguments when '.value()' is called", () => {
    const partialMax = partial(Math.max, Infinity);
    expect(partialMax(5)(3)(88)(9)(100)(17).value()).to.equal(100);
  });
  describe("should default the number of intermediate functions to the arity of the function if the second parameter is not a positive integer", () => {
    [
      0,
      -1,
      -999999,
      "foo",
      true,
      false,
      NaN,
      [1, 2, 3, 4, 5],
      [],
      {},
      { a: 1, b: 2 },
      null,
      undefined
    ].forEach(arity => {
      it(`should use the arity of the function instead of ${arity}`, () => {
        const fn = sinon.spy(function(a, b) {});
        const partialFn = partial(fn, arity);
        expect(fn.called).to.be.false;
        const intermediateFn = partialFn();
        expect(fn.called).to.be.false;
        intermediateFn();
        expect(fn.called).to.be.true;
      });
    });
  });
  describe("should allow the maximum number of intermediate functions to be overwritten by a positive integer", () => {
    it("should set the number of intermediate functions to 1", () => {
      const fn = sinon.spy(function(a, b) {});
      const partialFn = partial(fn, 1);
      expect(fn.called).to.be.false;
      partialFn();
      expect(fn.called).to.be.true;
    });
    it("should set the number of intermediate functions to 3", () => {
      const fn = sinon.spy(function(a, b) {});
      const partialFn = partial(fn, 3);
      expect(fn.called).to.be.false;
      const intermediateFn = partialFn();
      expect(fn.called).to.be.false;
      const secondIntermediateFn = intermediateFn();
      expect(fn.called).to.be.false;
      secondIntermediateFn();
      expect(fn.called).to.be.true;
    });
    it("should round up fractional numbers to the nearest integer for arity", () => {
      const fn = sinon.spy(function(a, b) {});
      const partialFn = partial(fn, 3.14);
      expect(fn.called).to.be.false;
      const intermediateFn = partialFn();
      expect(fn.called).to.be.false;
      const secondIntermediateFn = intermediateFn();
      expect(fn.called).to.be.false;
      const thirdIntermediateFn = secondIntermediateFn();
      expect(fn.called).to.be.false;
      thirdIntermediateFn();
      expect(fn.called).to.be.true;
    });
  });
  describe("should allow placeholders", () => {
    it("should backfill placeholder arguments", () => {
      function log(a,b,c) { return `${a}${b}${c}`; }
      const partialLog = partial(log);
      const { _ } = partial;
      expect(partial(log)(_, _, 'c')('a', 'b')).to.equal('abc');
      expect(partial(log)(_, _, 'c')(_, 'b')('a')).to.equal('abc');
    });
    it("should ignore extraneous arguments", () => {
      function log(a,b,c) { return Array.prototype.slice.call(arguments).join(''); }
      const { _ } = partial;
      expect(partial(log)(_, _, 'c')('a', 'b', 'd')).to.equal('abc');
    });
  });
});
