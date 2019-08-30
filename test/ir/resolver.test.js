const utils = require("../../src/utils");
const context = require("../../src/ir/context");
const resolver = require("../../src/ir/resolver");

let dummyRootCtx = context();
let dummyCtx = context(dummyRootCtx);

beforeEach(() => {
  dummyRootCtx = context();
  dummyCtx = context(dummyRootCtx);
});

const dummyMeta = {};
const dummyValidator = { addError: () => {} };
const dummySymbolA = { loc: {}, type: "SYMBOL", value: "a" };
const dummySymbolB = { loc: {}, type: "SYMBOL", value: "b" };
const dummySymbolC = { loc: {}, type: "SYMBOL", value: "c" };
const dummyString = { loc: {}, type: "STRING", value: "a" };
const dummyKeyword = { loc: {}, type: "KEYWORD", value: "a" };
const dummyNumber = { loc: {}, type: "NUMBER", value: 1 };
const dummyVector = { loc: {}, type: "VECTOR", value: [] };

describe("resolver", () => {
  describe("resolveSymbol", () => {
    it("should return an object with type `MEMBER` if the node is a `SYMBOL` and global", () => {
      dummyCtx.addDefinition(dummySymbolA.value, false, dummySymbolA, true);
      dummyCtx.addDefinition(dummySymbolB.value, false, dummySymbolB, true);
      dummyCtx.addDefinition(dummySymbolC.value, false, dummySymbolC, true);

      const resolvedA = resolver.resolveSymbol(dummySymbolA, dummyCtx);
      const resolvedB = resolver.resolveSymbol(dummySymbolB, dummyCtx);
      const resolvedC = resolver.resolveSymbol(dummySymbolC, dummyCtx);

      expect(resolvedA.type).toBe("MEMBER");
      expect(resolvedB.type).toBe("MEMBER");
      expect(resolvedC.type).toBe("MEMBER");

      expect(resolvedA.member).toBe(dummySymbolA.value);
      expect(resolvedB.member).toBe(dummySymbolB.value);
      expect(resolvedC.member).toBe(dummySymbolC.value);

      expect(resolvedA.owner).toBe(utils.GLOBALS);
      expect(resolvedB.owner).toBe(utils.GLOBALS);
      expect(resolvedC.owner).toBe(utils.GLOBALS);
    });

    it("should return the node it self if its not global or is not a `SYMBOL`", () => {
      dummyCtx.addDefinition(dummySymbolA.value, false, dummySymbolA, false);
      dummyCtx.addDefinition(dummySymbolB.value, false, dummySymbolB, false);
      dummyCtx.addDefinition(dummyNumber.value, false, dummySymbolC, false);

      const resolvedA = resolver.resolveSymbol(dummySymbolA, dummyCtx);
      const resolvedB = resolver.resolveSymbol(dummySymbolB, dummyCtx);
      const resolvedNumber = resolver.resolveSymbol(dummyNumber, dummyCtx);

      expect(resolvedA).toBe(dummySymbolA);
      expect(resolvedB).toBe(dummySymbolB);
      expect(resolvedNumber).toBe(dummyNumber);
    });

    it("should return a member if the context is the root and the node is a `SYMBOL`", () => {
      dummyRootCtx.addDefinition(
        dummySymbolA.value,
        false,
        dummySymbolA,
        false
      );

      dummyRootCtx.addDefinition(
        dummySymbolB.value,
        false,
        dummySymbolB,
        false
      );

      const resolvedA = resolver.resolveSymbol(dummySymbolA, dummyRootCtx);
      const resolvedB = resolver.resolveSymbol(dummySymbolB, dummyRootCtx);
      const resolvedNumber = resolver.resolveSymbol(dummyNumber, dummyRootCtx);

      expect(resolvedNumber).toBe(dummyNumber);

      expect(resolvedA.type).toBe("MEMBER");
      expect(resolvedB.type).toBe("MEMBER");

      expect(resolvedA.member).toBe(dummySymbolA.value);
      expect(resolvedB.member).toBe(dummySymbolB.value);

      expect(resolvedA.owner).toBe(utils.GLOBALS);
      expect(resolvedB.owner).toBe(utils.GLOBALS);
    });
  });
});
