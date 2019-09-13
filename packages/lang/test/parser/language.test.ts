import { ParserType } from "../../src/parser/types";
import { language } from "../../src/parser/language";

const testParser = (parser, type, opts) => {
  opts.forEach(opt => {
    expect(parser.tryParse(opt).type).toBe(type);
  });
};

const otherStrings = (
  parser,
  { symbol, list, null_, set, map, vector, string, number, keyword, bool }: any
) => {
  !symbol && expect(parser.parse("a").status).toBe(false);
  !vector && expect(parser.parse("[]").status).toBe(false);
  !list && expect(parser.parse("()").status).toBe(false);
  !map && expect(parser.parse("{}").status).toBe(false);
  !string && expect(parser.parse('"Hi!"').status).toBe(false);
  !keyword && expect(parser.parse(":keyword").status).toBe(false);
  !set && expect(parser.parse("#{}").status).toBe(false);
  !number && expect(parser.parse("1").status).toBe(false);
  !number && expect(parser.parse("1.1").status).toBe(false);
  !bool && expect(parser.parse("true").status).toBe(false);
  !bool && expect(parser.parse("false").status).toBe(false);
  !null_ && expect(parser.parse("null").status).toBe(false);
};

describe("language", () => {
  describe("List", () => {
    it("should take a string representing a list and returns a `LIST` node type", () => {
      testParser(language.List, ParserType.LIST, [
        "()",
        '(1 2 3 :a "Hi!" 1.1 {} [])'
      ]);
    });

    it("should fail to parse other strings", () => {
      otherStrings(language.List, { list: true });
    });
  });

  describe("Map", () => {
    it("should take a string representing a map and returns a `MAP` node type", () => {
      testParser(language.Map, ParserType.MAP, [
        "{}",
        '{1 2 3 :a "Hi!" 1.1 {} []}'
      ]);
    });

    it("should fail to parse other strings", () => {
      otherStrings(language.Map, { map: true });
    });
  });

  describe("Set", () => {
    it("should take a string representing a set and returns a `SET` node type", () => {
      testParser(language.Set, ParserType.SET, [
        "#{}",
        '#{1 2 3 :a "Hi!" 1.1 {} []}'
      ]);
    });

    it("should fail to parse other strings", () => {
      otherStrings(language.Set, { set: true });
    });
  });

  describe("Number", () => {
    it("should take a string representing a number and returns a `NUMBER` node type", () => {
      testParser(language.Number, ParserType.NUMBER, ["1.1", "-1.1", "1"]);
    });

    it("should fail to parse other strings", () => {
      otherStrings(language.Number, { number: true });
    });
  });

  describe("String", () => {
    it("should take a string representing a string and returns a `STRING` node type", () => {
      testParser(language.String, ParserType.STRING, [
        '"Hello"',
        '"Hello, world"'
      ]);
    });

    it("should fail to parse other strings", () => {
      otherStrings(language.String, { string: true });
    });
  });

  describe("Keyword", () => {
    it("should take a string representing a keyword and returns a `KEYWORD` node type", () => {
      testParser(language.Keyword, ParserType.KEYWORD, [":a", ":bcdef/s"]);
    });

    it("should fail to parse other strings", () => {
      otherStrings(language.Keyword, { keyword: true });
    });
  });

  describe("Symbol", () => {
    it("should take a string representing a symbol and returns a `SYMBOL` node type", () => {
      testParser(language.Symbol, ParserType.SYMBOL, ["a", "bcdef/s"]);
    });

    it("should fail to parse other strings", () => {
      otherStrings(language.Symbol, { symbol: true, bool: true, null_: true });
    });
  });

  describe("Bool", () => {
    it("should take a string representing a bool and returns a `BOOL` node type", () => {
      testParser(language.Bool, ParserType.BOOL, ["true", "false"]);
    });

    it("should fail to parse other strings", () => {
      otherStrings(language.Bool, { bool: true });
    });
  });

  describe("Null", () => {
    it("should take a string representing a null and returns a `NULL` node type", () => {
      testParser(language.Null, ParserType.NULL, ["null"]);
    });

    it("should fail to parse other strings", () => {
      otherStrings(language.Null, { null_: true });
    });
  });

  describe("Expression", () => {
    it("should take a string representing an expression and returns a node", () => {
      otherStrings(language.Expression, {
        symbol: true,
        list: true,
        null_: true,
        set: true,
        map: true,
        vector: true,
        string: true,
        number: true,
        keyword: true,
        bool: true
      });
    });
  });
});
