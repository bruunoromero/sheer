const t = require("../../src/parser/types");
const language = require("../../src/parser/language");

describe("language", () => {
  describe("List", () => {
    it("should take a string representing a list and returns a `LIST` node type", () => {
      expect(language.List.tryParse("()").type).toBe(t.LIST);
      expect(language.List.tryParse('(1 2 3 :a "Hi!" 1.1 {} [])').type).toBe(
        t.LIST
      );
    });

    it("should fail to parse other strings", () => {
      expect(language.List.parse("[]").status).toBe(false);
      expect(language.List.parse("{}").status).toBe(false);
      expect(language.List.parse("1").status).toBe(false);
      expect(language.List.parse('"Hi!"').status).toBe(false);
      expect(language.List.parse(":keyword").status).toBe(false);
      expect(language.List.parse("#{}").status).toBe(false);
      expect(language.List.parse("1.1").status).toBe(false);
    });
  });

  describe("Map", () => {
    it("should take a string representing a map and returns a `MAP` node type", () => {
      expect(language.Map.tryParse("{}").type).toBe(t.MAP);
      expect(language.Map.tryParse('{1 2 3 :a "Hi!" 1.1 {} []}').type).toBe(
        t.MAP
      );
    });

    it("should fail to parse other strings", () => {
      expect(language.Map.parse("[]").status).toBe(false);
      expect(language.Map.parse("()").status).toBe(false);
      expect(language.Map.parse("1").status).toBe(false);
      expect(language.Map.parse('"Hi!"').status).toBe(false);
      expect(language.Map.parse(":keyword").status).toBe(false);
      expect(language.Map.parse("#{}").status).toBe(false);
      expect(language.Map.parse("1.1").status).toBe(false);
    });
  });

  describe("Set", () => {
    it("should take a string representing a set and returns a `SET` node type", () => {
      expect(language.Set.tryParse("#{}").type).toBe(t.SET);
      expect(language.Set.tryParse('#{1 2 3 :a "Hi!" 1.1 {} []}').type).toBe(
        t.SET
      );
    });

    it("should fail to parse other strings", () => {
      expect(language.Set.parse("[]").status).toBe(false);
      expect(language.Set.parse("{}").status).toBe(false);
      expect(language.Set.parse("1").status).toBe(false);
      expect(language.Set.parse('"Hi!"').status).toBe(false);
      expect(language.Set.parse(":keyword").status).toBe(false);
      expect(language.Set.parse("()").status).toBe(false);
      expect(language.Set.parse("1.1").status).toBe(false);
    });
  });

  describe("Number", () => {
    it("should take a string representing a number and returns a `NUMBER` node type", () => {
      expect(language.Number.tryParse("1.1").type).toBe(t.NUMBER);
      expect(language.Number.tryParse("-1.1").type).toBe(t.NUMBER);
      expect(language.Number.tryParse("1").type).toBe(t.NUMBER);
    });

    it("should fail to parse other strings", () => {
      expect(language.Number.parse("[]").status).toBe(false);
      expect(language.Number.parse("{}").status).toBe(false);
      expect(language.Number.parse("()").status).toBe(false);
      expect(language.Number.parse('"Hi!"').status).toBe(false);
      expect(language.Number.parse(":keyword").status).toBe(false);
      expect(language.Number.parse("#{}").status).toBe(false);
    });
  });

  describe("String", () => {
    it("should take a string representing a string and returns a `STRING` node type", () => {
      expect(language.String.tryParse('"Hello"').type).toBe(t.STRING);
      expect(language.String.tryParse('"Hello, world"').type).toBe(t.STRING);
    });

    it("should fail to parse other strings", () => {
      expect(language.String.parse("[]").status).toBe(false);
      expect(language.String.parse("{}").status).toBe(false);
      expect(language.String.parse("1").status).toBe(false);
      expect(language.String.parse("()").status).toBe(false);
      expect(language.String.parse(":keyword").status).toBe(false);
      expect(language.String.parse("#{}").status).toBe(false);
      expect(language.String.parse("1.1").status).toBe(false);
    });
  });

  describe("Keyword", () => {
    it("should take a string representing a list and returns a `LIST` node type", () => {
      expect(language.Keyword.tryParse(":a").type).toBe(t.KEYWORD);
      expect(language.Keyword.tryParse(":bcdef/s").type).toBe(t.KEYWORD);
    });

    it("should fail to parse other strings", () => {
      expect(language.Keyword.parse("[]").status).toBe(false);
      expect(language.Keyword.parse("{}").status).toBe(false);
      expect(language.Keyword.parse("1").status).toBe(false);
      expect(language.Keyword.parse('"Hi!"').status).toBe(false);
      expect(language.Keyword.parse("()").status).toBe(false);
      expect(language.Keyword.parse("#{}").status).toBe(false);
      expect(language.Keyword.parse("1.1").status).toBe(false);
    });
  });
});
