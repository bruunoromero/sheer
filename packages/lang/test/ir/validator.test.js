const validator = require("../../src/ir/validator");
const {
  dummyNumber,
  dummyVector,
  dummyString,
  dummySymbol,
  dummyKeyword
} = require("../../mocks/parser/nodes");

const { dummyMeta } = require("../../mocks/ir/nodes");
const dummyValidator = require("../../mocks/ir/validator");

describe("validator", () => {
  describe("def", () => {
    it("should return true if it has only 2 args and the first argument is a `SYMBOL`", () => {
      expect(
        validator.def(dummyValidator, dummyMeta, [dummySymbol, dummyNumber])
      ).toBe(true);
      expect(
        validator.def(dummyValidator, dummyMeta, [dummySymbol, dummyNumber])
      ).toBe(true);
    });

    it("should fail if it has more than 2 args", () => {
      expect(
        validator.def(dummyValidator, dummyMeta, [
          dummySymbol,
          dummyNumber,
          dummyNumber,
          dummyNumber
        ])
      ).toBe(false);
      expect(
        validator.def(dummyValidator, dummyMeta, [
          dummySymbol,
          dummyNumber,
          dummyNumber
        ])
      ).toBe(false);
    });

    it("should fail if it only one argument", () => {
      expect(validator.def(dummyValidator, dummyMeta, [dummySymbol])).toBe(
        false
      );
    });

    it("should fail if the first argument is not of type `SYMBOL`", () => {
      expect(validator.def(dummyValidator, dummyMeta, [dummyNumber])).toBe(
        false
      );
      expect(validator.def(dummyValidator, dummyMeta, [dummyString])).toBe(
        false
      );
      expect(validator.def(dummyValidator, dummyMeta, [dummyKeyword])).toBe(
        false
      );
    });
  });

  describe("fn", () => {
    it("should return true if it has 2 or more arguments and the first one is a `VECTOR`", () => {
      expect(
        validator.fn(dummyValidator, dummyMeta, [dummyVector, dummyNumber])
      ).toBe(true);
      expect(
        validator.fn(dummyValidator, dummyMeta, [
          dummyVector,
          dummyString,
          dummyNumber,
          dummyKeyword
        ])
      ).toBe(true);
    });

    it("should fail if the first argument is not of type `VECTOR`", () => {
      expect(
        validator.fn(dummyValidator, dummyMeta, [dummySymbol, dummyNumber])
      ).toBe(false);
      expect(
        validator.fn(dummyValidator, dummyMeta, [
          dummyString,
          dummyVector,
          dummyNumber,
          dummyKeyword
        ])
      ).toBe(false);
    });

    it("should fail if it only has one argument", () => {
      expect(validator.fn(dummyValidator, dummyMeta, [dummySymbol])).toBe(
        false
      );
    });
  });

  describe("defn", () => {
    it("should return true if it has more than 2 args, the first argument is a `SYMBOL` and the second is a `VECTOR`", () => {
      expect(
        validator.defn(dummyValidator, dummyMeta, [
          dummySymbol,
          dummyVector,
          dummyString
        ])
      ).toBe(true);

      expect(
        validator.defn(dummyValidator, dummyMeta, [
          dummySymbol,
          dummyVector,
          dummyString,
          dummyNumber,
          dummyKeyword
        ])
      ).toBe(true);
    });

    it("should fail if the first argument is not of type `SYMBOL` or the second is not a `VECTOR`", () => {
      expect(
        validator.defn(dummyValidator, dummyMeta, [
          dummySymbol,
          dummyNumber,
          dummyVector
        ])
      ).toBe(false);

      expect(
        validator.defn(dummyValidator, dummyMeta, [
          dummyNumber,
          dummyVector,
          dummySymbol
        ])
      ).toBe(false);

      expect(
        validator.defn(dummyValidator, dummyMeta, [
          dummyKeyword,
          dummyString,
          dummyNumber
        ])
      ).toBe(false);
    });

    it("should fail if it only has one or two argument", () => {
      expect(validator.defn(dummyValidator, dummyMeta, [dummySymbol])).toBe(
        false
      );
      expect(
        validator.defn(dummyValidator, dummyMeta, [dummySymbol, dummyVector])
      ).toBe(false);
    });
  });

  describe("if", () => {
    it("should return true if it has 3 arguments", () => {
      expect(
        validator.if_(dummyValidator, dummyMeta, [
          dummySymbol,
          dummyVector,
          dummyString
        ])
      ).toBe(true);

      expect(
        validator.if_(dummyValidator, dummyMeta, [
          dummyString,
          dummyNumber,
          dummyKeyword
        ])
      ).toBe(true);
    });

    it("should fail if it has less than 3 arguments", () => {
      expect(validator.if_(dummyValidator, dummyMeta, [dummySymbol])).toBe(
        false
      );

      expect(
        validator.if_(dummyValidator, dummyMeta, [dummyString, dummyNumber])
      ).toBe(false);
    });

    it("should fail if it has more than 3 arguments", () => {
      expect(
        validator.if_(dummyValidator, dummyMeta, [
          dummySymbol,
          dummyVector,
          dummyString,
          dummyKeyword
        ])
      ).toBe(false);

      expect(
        validator.if_(dummyValidator, dummyMeta, [
          dummyString,
          dummyNumber,
          dummyKeyword,
          dummyString,
          dummySymbol
        ])
      ).toBe(false);
    });
  });

  describe("when", () => {
    it("should return true if it has 2 arguments", () => {
      expect(
        validator.when(dummyValidator, dummyMeta, [dummySymbol, dummyVector])
      ).toBe(true);

      expect(
        validator.when(dummyValidator, dummyMeta, [dummyString, dummyNumber])
      ).toBe(true);
    });

    it("should fail if it has 1 argument", () => {
      expect(validator.when(dummyValidator, dummyMeta, [dummySymbol])).toBe(
        false
      );

      expect(validator.when(dummyValidator, dummyMeta, [dummyString])).toBe(
        false
      );
    });

    it("should fail if it has more than 2 arguments", () => {
      expect(
        validator.when(dummyValidator, dummyMeta, [
          dummySymbol,
          dummyVector,
          dummyString
        ])
      ).toBe(false);

      expect(
        validator.when(dummyValidator, dummyMeta, [
          dummyString,
          dummyNumber,
          dummyKeyword,
          dummyString
        ])
      ).toBe(false);
    });
  });

  describe("not", () => {
    it("should return true if it has 1 argument", () => {
      expect(validator.not(dummyValidator, dummyMeta, [dummySymbol])).toBe(
        true
      );

      expect(validator.not(dummyValidator, dummyMeta, [dummyString])).toBe(
        true
      );
    });

    it("should fail if it has more than 1 argument", () => {
      expect(
        validator.not(dummyValidator, dummyMeta, [
          dummySymbol,
          dummyVector,
          dummyString
        ])
      ).toBe(false);

      expect(
        validator.not(dummyValidator, dummyMeta, [dummySymbol, dummyString])
      ).toBe(false);
    });

    it("should fail if it has zero arguments", () => {
      expect(validator.not(dummyValidator, dummyMeta, [])).toBe(false);
    });
  });

  describe("not=", () => {
    it("should return true if it has 1 or more argument", () => {
      expect(validator.notEq(dummyValidator, dummyMeta, [dummySymbol])).toBe(
        true
      );

      expect(
        validator.notEq(dummyValidator, dummyMeta, [dummyString, dummyKeyword])
      ).toBe(true);

      expect(
        validator.notEq(dummyValidator, dummyMeta, [
          dummyString,
          dummyKeyword,
          dummyNumber,
          dummySymbol
        ])
      ).toBe(true);
    });

    it("should fail if it has zero arguments", () => {
      expect(validator.notEq(dummyValidator, dummyMeta, [])).toBe(false);
    });
  });
});
