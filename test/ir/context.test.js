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

  describe("root", () => {
    it("should return the ctx itself if its the root", () => {
      expect(ctx.root()).toBe(ctx);
    });

    it("should return the root context", () => {
      const ctx2 = context(ctx);
      const ctx3 = context(ctx2);

      expect(ctx3.root()).toBe(ctx);
    });
  });

  describe("addDefinition", () => {
    it("should add a value to the defs map", () => {
      ctx.addDefinition("a", false, 10);
      expect(ctx._defs().a).toBe(10);
    });

    it("should add a value to the defs map to the root ctx if the `isGlobal` it true", () => {
      const ctx2 = context(ctx);
      ctx2.addDefinition("b", false, 20, true);
      expect(ctx2._defs().b).toBe(undefined);
      expect(ctx2.root()._defs().b).toEqual(20);
    });

    it("should add the name to the exports list if the second argument is true", () => {
      ctx.addDefinition("c", true, 20);
      expect(ctx._defs().c).toBe(20);
      expect(ctx.exports()).toEqual(["c"]);
    });
  });

  describe("resolve", () => {
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

  describe("definitions", () => {
    it("should return all the definitions names in a context, if a name was not provided", () => {
      ctx.addDefinition("a", true, 20);
      ctx.addDefinition("b", true, 20);
      ctx.addDefinition("c", true, 20);

      expect(ctx.definitions()).toEqual(["a", "b", "c"]);
    });

    it("should return a definition meta if the name wa provided", () => {
      ctx.addDefinition("a", true, 10);
      ctx.addDefinition("b", true, 20);
      ctx.addDefinition("c", true, 30);

      expect(ctx.definitions("a")).toBe(10);
      expect(ctx.definitions("b")).toBe(20);
      expect(ctx.definitions("c")).toBe(30);
    });

    it("should not return the definition if its global and the ctx is not the root", () => {
      const ctx2 = context(ctx);

      ctx2.addDefinition("a", true, 10);
      ctx2.addDefinition("b", true, 20);
      ctx2.addDefinition("c", true, 30, true);

      expect(ctx2.definitions("a")).toBe(10);
      expect(ctx2.definitions("b")).toBe(20);
      expect(ctx2.definitions("c")).toBe(undefined);
    });
  });
});
