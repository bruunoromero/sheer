const transformer = require("../../src/ir/transformer");

const dummyNumber = { loc: {}, type: "NUMBER", value: 1 };
const dummyVector = { loc: {}, type: "VECTOR", value: [] };
const dummyString = { loc: {}, type: "STRING", value: "a" };
const dummySymbolA = { loc: {}, type: "SYMBOL", value: "a" };
const dummySymbolB = { loc: {}, type: "SYMBOL", value: "b" };
const dummySymbolC = { loc: {}, type: "SYMBOL", value: "c" };
const dummyKeyword = { loc: {}, type: "KEYWORD", value: "a" };

describe("transformer", () => {
  describe("primitive", () => {
    it("should take a node and return an object with a type and a value", () => {
      expect(transformer.primitive(dummyNumber).value).toBe(1);
      expect(transformer.primitive(dummyNumber).type).toBe("NUMBER");

      expect(transformer.primitive(dummyString).value).toBe("a");
      expect(transformer.primitive(dummyString).type).toBe("STRING");

      expect(transformer.primitive(dummyKeyword).value).toBe("a");
      expect(transformer.primitive(dummyKeyword).type).toBe("KEYWORD");
    });
  });

  describe("vector", () => {
    it("should take an array of nodes and returns a node of type `VECTOR`", () => {
      const nodes = [dummyKeyword, dummyNumber, dummyString];

      expect(transformer.vector(nodes).value).toBe(nodes);
      expect(transformer.vector(nodes).type).toBe("VECTOR");
    });
  });

  describe("fn", () => {
    it("should take 2 array of nodes - the params and body - and returns a node of type `FN`", () => {
      const params = [dummySymbolA, dummySymbolB, dummySymbolC];
      const body = [dummyKeyword, dummyNumber, dummyString];

      expect(transformer.fn(params, body).type).toBe("FN");
      expect(transformer.fn(params, body).body).toBe(body);
      expect(transformer.fn(params, body).params).toBe(params);
    });
  });

  describe("symbol", () => {
    it("should take a symbol node and return and a node with type `SYMBOL`", () => {
      expect(transformer.symbol(dummySymbolA).value).toBe("a");
      expect(transformer.symbol(dummySymbolA).type).toBe("SYMBOL");

      expect(transformer.symbol(dummySymbolB).value).toBe("b");
      expect(transformer.symbol(dummySymbolB).type).toBe("SYMBOL");
    });
  });

  describe("if", () => {
    it("should take a cond, truthy and falsy nodes and returns a `IF` node", () => {
      expect(
        transformer.if_(dummySymbolA, dummySymbolB, dummySymbolC).type
      ).toBe("IF");
      expect(
        transformer.if_(dummySymbolA, dummySymbolB, dummySymbolC).cond
      ).toBe(dummySymbolA);
      expect(
        transformer.if_(dummySymbolA, dummySymbolB, dummySymbolC).truthy
      ).toBe(dummySymbolB);
      expect(
        transformer.if_(dummySymbolA, dummySymbolB, dummySymbolC).falsy
      ).toBe(dummySymbolC);
    });
  });

  describe("when", () => {
    it("should take a cond and truthy nodes and returns a `IF` node with null node as falsy", () => {
      expect(transformer.when(dummySymbolA, dummySymbolB).type).toBe("IF");
      expect(transformer.when(dummySymbolA, dummySymbolB).cond).toBe(
        dummySymbolA
      );
      expect(transformer.when(dummySymbolA, dummySymbolB).truthy).toBe(
        dummySymbolB
      );
      expect(transformer.when(dummySymbolA, dummySymbolB).falsy).toBe(
        transformer.null_
      );
    });
  });

  describe("def", () => {
    it("should take a symbol and another node, and returns a `DEF` node", () => {
      expect(transformer.def(dummySymbolA, dummyNumber).type).toBe("DEF");
      expect(transformer.def(dummySymbolA, dummyNumber).name).toBe(
        dummySymbolA.value
      );
      expect(transformer.def(dummySymbolA, dummyNumber).value).toBe(
        dummyNumber
      );
    });
  });

  describe("not", () => {
    it("should take a node and return a `NOT` node with the original node as value", () => {
      expect(transformer.not(dummySymbolA).type).toBe("NOT");
      expect(transformer.not(dummySymbolA).value).toBe(dummySymbolA);

      expect(transformer.not(dummyNumber).type).toBe("NOT");
      expect(transformer.not(dummyNumber).value).toBe(dummyNumber);
    });
  });

  describe("declare", () => {
    it("should take a string - the name to be declared -,  a node - initial value - and a bool - if its global -, and returns a `DECLARE` node", () => {
      expect(transformer.declare("a", dummySymbolA, true).type).toBe("DECLARE");
      expect(transformer.declare("a", dummySymbolA, true).value).toBe("a");
      expect(transformer.declare("a", dummySymbolA, true).isGlobal).toBe(true);
      expect(transformer.declare("a", dummySymbolA, true).init).toBe(
        dummySymbolA
      );

      expect(transformer.declare("b", dummyNumber, false).type).toBe("DECLARE");
      expect(transformer.declare("b", dummyNumber, false).value).toBe("b");
      expect(transformer.declare("b", dummyNumber, false).isGlobal).toBe(false);
      expect(transformer.declare("b", dummyNumber, false).init).toBe(
        dummyNumber
      );
    });
  });

  describe("member", () => {
    it("should take a tuple of nodes and returns a member node", () => {
      expect(transformer.member([dummySymbolA, dummySymbolB]).type).toBe(
        "MEMBER"
      );
      expect(transformer.member([dummySymbolA, dummySymbolB]).owner).toBe(
        dummySymbolA
      );
      expect(transformer.member([dummySymbolA, dummySymbolB]).member).toBe(
        dummySymbolB
      );

      expect(transformer.member([dummySymbolB, dummySymbolA]).type).toBe(
        "MEMBER"
      );
      expect(transformer.member([dummySymbolB, dummySymbolA]).owner).toBe(
        dummySymbolB
      );
      expect(transformer.member([dummySymbolB, dummySymbolA]).member).toBe(
        dummySymbolA
      );
    });
  });

  describe("fnCall", () => {
    it("should take a callee and an array of nodes, an returns a `FN_CALL` node", () => {
      const args1 = [dummySymbolA, dummySymbolB];
      const args2 = [dummySymbolB, dummySymbolA];

      expect(transformer.fnCall(dummySymbolC, args1).type).toBe("FN_CALL");
      expect(transformer.fnCall(dummySymbolC, args1).callee).toBe(dummySymbolC);
      expect(transformer.fnCall(dummySymbolC, args1).args).toBe(args1);

      expect(transformer.fnCall(dummySymbolC, args2).type).toBe("FN_CALL");
      expect(transformer.fnCall(dummySymbolC, args2).callee).toBe(dummySymbolC);
      expect(transformer.fnCall(dummySymbolC, args2).args).toBe(args2);
    });
  });
});
