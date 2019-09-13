import { ParserType } from "../../src/parser/types";
import * as transformer from "../../src/parser/transformer";

describe("tranformer", () => {
  describe("list", () => {
    it("should take an object with a `value` key, and return a list type object", () => {
      const node1 = { value: 10 } as any;
      const transformed1 = transformer.list(node1);

      const node2 = { value: 20 } as any;
      const transformed2 = transformer.list(node2);

      expect(transformed1.type).toBe(ParserType.LIST);
      expect(transformed1.value).toBe(node1.value);

      expect(transformed2.type).toBe(ParserType.LIST);
      expect(transformed2.value).toBe(node2.value);
    });
  });

  describe("vector", () => {
    it("should take an object with a `value` key, and return a vector type object", () => {
      const node1 = { value: 10 } as any;
      const transformed1 = transformer.vector(node1);

      const node2 = { value: 20 } as any;
      const transformed2 = transformer.vector(node2);

      expect(transformed1.type).toBe(ParserType.VECTOR);
      expect(transformed1.value).toBe(node1.value);

      expect(transformed2.type).toBe(ParserType.VECTOR);
      expect(transformed2.value).toBe(node2.value);
    });
  });

  describe("set", () => {
    it("should take an object with a `value` key, and return a set type object", () => {
      const node1 = { value: 10 } as any;
      const transformed1 = transformer.set(node1);

      const node2 = { value: 20 } as any;
      const transformed2 = transformer.set(node2);

      expect(transformed1.type).toBe(ParserType.SET);
      expect(transformed1.value).toBe(node1.value);

      expect(transformed2.type).toBe(ParserType.SET);
      expect(transformed2.value).toBe(node2.value);
    });
  });

  describe("map", () => {
    it("should take an object with a `value` key, and return a map type object", () => {
      const node1 = { value: [1, 2, 3, 4] } as any;
      const transformed1 = transformer.map(node1);

      const node2 = { value: [4, 3, 2, 1] } as any;
      const transformed2 = transformer.map(node2);

      expect(transformed1.type).toBe(ParserType.MAP);
      expect(transformed1.value).toEqual([[1, 2], [3, 4]]);

      expect(transformed2.type).toBe(ParserType.MAP);
      expect(transformed2.value).toEqual([[4, 3], [2, 1]]);
    });
  });

  describe("stringLiteral", () => {
    it("should take an object with a `value` key, and return a stringLiteral type object", () => {
      const node1 = { value: "Hello, World" } as any;
      const transformed1 = transformer.stringLiteral(node1);

      const node2 = { value: "Hello from the other side" } as any;
      const transformed2 = transformer.stringLiteral(node2);

      expect(transformed1.type).toBe(ParserType.STRING);
      expect(transformed1.value).toBe("Hello, World");

      expect(transformed2.type).toBe(ParserType.STRING);
      expect(transformed2.value).toBe("Hello from the other side");
    });
  });

  describe("symbol", () => {
    it("should take an object with a `value` key, and return a symbol type object", () => {
      const node1 = { value: "abc" } as any;
      const transformed1 = transformer.symbol(node1);

      const node2 = { value: "def" } as any;
      const transformed2 = transformer.symbol(node2);

      expect(transformed1.type).toBe(ParserType.SYMBOL);
      expect(transformed1.value).toBe(node1.value);

      expect(transformed2.type).toBe(ParserType.SYMBOL);
      expect(transformed2.value).toBe(node2.value);
    });
  });

  describe("keyword", () => {
    it("should take an object with a `value` key, and return a keyword type object", () => {
      const node1 = { value: "abc" } as any;
      const transformed1 = transformer.keyword(node1);

      const node2 = { value: "def" } as any;
      const transformed2 = transformer.keyword(node2);

      expect(transformed1.type).toBe(ParserType.KEYWORD);
      expect(transformed1.value).toBe("abc");

      expect(transformed2.type).toBe(ParserType.KEYWORD);
      expect(transformed2.value).toBe("def");
    });
  });

  describe("numberLiteral", () => {
    it("should take an object with a `value` key, and return a numberLiteral type object", () => {
      const node1 = { value: 10 } as any;
      const transformed1 = transformer.numberLiteral(node1);

      const node2 = { value: "20" } as any;
      const transformed2 = transformer.numberLiteral(node2);

      expect(transformed1.type).toBe(ParserType.NUMBER);
      expect(transformed1.value).toBe(10);

      expect(transformed2.type).toBe(ParserType.NUMBER);
      expect(transformed2.value).toBe(20);
    });
  });

  describe("nullLiteral", () => {
    it("should take and return a nullLiteral type object", () => {
      const node = {} as any;
      const transformed = transformer.nullLiteral(node);

      expect(transformed.type).toBe(ParserType.NULL);
    });
  });

  describe("boolLiteral", () => {
    it("should take an object with a `value` key, and return a boolLiteral type object", () => {
      const node1 = { value: "true" } as any;
      const transformed1 = transformer.boolLiteral(node1);

      const node2 = { value: "false" } as any;
      const transformed2 = transformer.boolLiteral(node2);

      expect(transformed1.type).toBe(ParserType.BOOL);
      expect(transformed1.value).toBe(true);

      expect(transformed2.type).toBe(ParserType.BOOL);
      expect(transformed2.value).toBe(false);
    });
  });
});
