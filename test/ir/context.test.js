const context = require("../../src/ir/context");

let ctx;

beforeEach(() => {
  ctx = context();
});

describe("context", () => {
  describe("name", () => {
    it("should return null if a name was not provided", () => {
      expect(ctx.name()).toBe(null);
    });

    it("should return the name if the name is provided", () => {
      expect(ctx.name("abc")).toBe("abc");
      expect(ctx.name()).toBe("abc");
    });
  });

  describe("addDefinition", () => {
    it("should add a value to the defs map", () => {
      ctx.addDefinition("a", false, 10);
      expect(ctx._defs().a).toBe(10);
    });

    it("should add the name to the exports list if the second argument is true", () => {
      ctx.addDefinition("b", true, 20);
      expect(ctx._defs().b).toBe(20);
      expect(ctx.exports()).toEqual(["b"]);
    });
  });
});
