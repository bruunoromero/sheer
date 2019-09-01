const context = require("../../src/ir/context");
const traverser = require("../../src/ir/traverser");
const transformer = require("../../src/ir/transformer");

const dummyCore = require("../../mocks/ir/core_ops");

const {
  buildList,
  dummyList,
  dummyTrue,
  dummyNull,
  dummyFalse,
  buildSymbol,
  dummyVector,
  dummyString,
  dummySymbol,
  dummyNumber,
  dummyKeyword
} = require("../../mocks/parser/nodes");

jest.mock("../../src/ir/transformer");

let dummyCtx;
let dummyRootCtx;

const clearMock = obj => {
  for (let key in obj) {
    const fn = obj[key];

    if (fn.mockClear) {
      fn.mockClear();
    }
  }
};

beforeEach(() => {
  dummyRootCtx = context();
  dummyCtx = context(dummyRootCtx);
  clearMock(dummyCore);
  clearMock(traverser);
  clearMock(transformer);
});

describe("ir traverser", () => {
  describe("generateDefinitions", () => {
    it("it should take a context and generate a declare node for each global def on the context", () => {
      dummyCtx.addDefinition("a", true, 10, true);
      dummyCtx.addDefinition("b", false, 20, true);
      dummyCtx.addDefinition("c", true, 30, true);
      dummyCtx.addDefinition("d", true, 30, false);

      traverser.generateDefinitions(dummyRootCtx);

      expect(transformer.declare).toHaveBeenCalledTimes(3);
    });
  });

  describe("traverse", () => {
    it("should call transformer primitive if primitives were passed", () => {
      traverser.traverse(dummyNull, dummyRootCtx, dummyCore);
      traverser.traverse(dummyTrue, dummyRootCtx, dummyCore);
      traverser.traverse(dummyFalse, dummyRootCtx, dummyCore);
      traverser.traverse(dummyNumber, dummyRootCtx, dummyCore);
      traverser.traverse(dummyString, dummyRootCtx, dummyCore);
      traverser.traverse(dummyKeyword, dummyRootCtx, dummyCore);

      expect(transformer.primitive).toHaveBeenCalledTimes(6);
    });

    it("should not call transformer primitive if primitives were not passed", () => {
      traverser.traverse(dummyList, dummyRootCtx, dummyCore);
      traverser.traverse(dummySymbol, dummyRootCtx, dummyCore);
      traverser.traverse(dummyVector, dummyRootCtx, dummyCore);

      expect(transformer.primitive).toHaveBeenCalledTimes(0);
    });

    it("should call transformer vector if a vector was provided", () => {
      traverser.traverse(dummyList, dummyRootCtx, dummyCore);
      traverser.traverse(dummySymbol, dummyRootCtx, dummyCore);
      traverser.traverse(dummyVector, dummyRootCtx, dummyCore);

      expect(transformer.vector).toHaveBeenCalledTimes(1);
    });

    it("should call transformer symbol if a symbol was provided", () => {
      traverser.traverse(dummyList, dummyRootCtx, dummyCore);
      traverser.traverse(dummySymbol, dummyRootCtx, dummyCore);
      traverser.traverse(dummyVector, dummyRootCtx, dummyCore);

      expect(transformer.symbol).toHaveBeenCalledTimes(1);
    });

    it("should call transformer list if a list was provided", () => {
      traverser.traverse(dummyList, dummyRootCtx, dummyCore);
      traverser.traverse(dummySymbol, dummyRootCtx, dummyCore);
      traverser.traverse(dummyVector, dummyRootCtx, dummyCore);

      expect(transformer.list).toHaveBeenCalledTimes(1);
    });
  });

  describe("traverseList", () => {
    it("should call the transformer list if a empty list was provided", () => {
      traverser.traverseList(dummyList, dummyRootCtx, dummyCore);

      expect(transformer.list).toHaveBeenCalledTimes(1);
    });

    it("should call the correct core, depending of the frist element of the list provided", () => {
      [
        "=",
        "ns",
        "if",
        "fn",
        "or",
        "and",
        "not",
        "def",
        "def-",
        "call",
        "when",
        "not=",
        "defn",
        "defn-"
      ].forEach(el => {
        traverser.traverseList(
          buildList([buildSymbol(el)]),
          dummyRootCtx,
          dummyCore
        );
      });

      expect(dummyCore.ns).toHaveBeenCalledTimes(1);
      expect(dummyCore.or).toHaveBeenCalledTimes(1);
      expect(dummyCore.eq).toHaveBeenCalledTimes(1);
      expect(dummyCore.and).toHaveBeenCalledTimes(1);
      expect(dummyCore.not).toHaveBeenCalledTimes(1);
      expect(dummyCore.if_).toHaveBeenCalledTimes(1);
      expect(dummyCore.def).toHaveBeenCalledTimes(1);
      expect(dummyCore.defp).toHaveBeenCalledTimes(1);
      expect(dummyCore.when).toHaveBeenCalledTimes(1);
      expect(dummyCore.defn).toHaveBeenCalledTimes(1);
      expect(dummyCore.defnp).toHaveBeenCalledTimes(1);
      expect(dummyCore.notEq).toHaveBeenCalledTimes(1);
      expect(dummyCore.fnCall).toHaveBeenCalledTimes(1);
    });
  });
});
