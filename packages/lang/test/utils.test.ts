import * as path from "path";

import * as utils from "../src/utils";
import { SheerConfig } from "../src/project";

describe("utils", () => {
  describe("normalizeName", () => {
    it("should take a string and return a valid js variable name", () => {
      expect(utils.normalizeName("a")).toBe("a");
      expect(utils.normalizeName("ab")).toBe("ab");
      expect(utils.normalizeName("-a")).toBe("_a");
      expect(utils.normalizeName("=a")).toBe("_EQ_a");
      expect(utils.normalizeName("a<")).toBe("a_LT_");
      expect(utils.normalizeName("a>")).toBe("a_GT_");
      expect(utils.normalizeName("a.")).toBe("a_DOT_");
      expect(utils.normalizeName("a*")).toBe("a_STAR_");
      expect(utils.normalizeName("+a")).toBe("_PLUS_a");
      expect(utils.normalizeName("a!")).toBe("a_BANG_");
      expect(utils.normalizeName("a|")).toBe("a_PIPE_");
      expect(utils.normalizeName("a/")).toBe("a_FSLASH_");
      expect(utils.normalizeName("a\\")).toBe("a_BSLASH_");
      expect(utils.normalizeName("*ns*")).toBe("_STAR_ns_STAR_");
      expect(utils.normalizeName("abcd*!")).toBe("abcd_STAR__BANG_");
    });
  });

  describe("unnormalizeName", () => {
    it("should take a string and return a valid js variable name", () => {
      expect(utils.unnormalizeName("a")).toBe("a");
      expect(utils.unnormalizeName("ab")).toBe("ab");
      expect(utils.unnormalizeName("_a")).toBe("-a");
      expect(utils.unnormalizeName("_EQ_a")).toBe("=a");
      expect(utils.unnormalizeName("a_LT_")).toBe("a<");
      expect(utils.unnormalizeName("a_GT_")).toBe("a>");
      expect(utils.unnormalizeName("a_DOT_")).toBe("a.");
      expect(utils.unnormalizeName("a_STAR_")).toBe("a*");
      expect(utils.unnormalizeName("_PLUS_a")).toBe("+a");
      expect(utils.unnormalizeName("a_BANG_")).toBe("a!");
      expect(utils.unnormalizeName("a_PIPE_")).toBe("a|");
      expect(utils.unnormalizeName("a_FSLASH_")).toBe("a/");
      expect(utils.unnormalizeName("a_BSLASH_")).toBe("a\\");
      expect(utils.unnormalizeName("_STAR_ns_STAR_")).toBe("*ns*");
      expect(utils.unnormalizeName("abcd_STAR__BANG_")).toBe("abcd*!");
    });
  });

  describe("chunks", () => {
    it("should take and array and the size of the chunks, and returns an array containing arrays with that size", () => {
      utils.chunks([1, 2, 3, 4, 5, 6], 2).forEach(chunk => {
        expect(chunk.length).toBe(2);
      });

      utils.chunks([1, 2, 3, 4, 5, 6], 3).forEach(chunk => {
        expect(chunk.length).toBe(3);
      });
    });

    it("should return the last chunk with a number of elements less than the chunk size with the array has odd number of elements", () => {
      utils.chunks([1, 2, 3, 4, 5], 2).forEach((chunk, index, chunks) => {
        if (index === chunks.length - 1) {
          expect(chunk.length).toBe(1);
        } else {
          expect(chunk.length).toBe(2);
        }
      });

      utils.chunks([1], 4).forEach(chunk => {
        expect(chunk.length).toBe(1);
      });
    });
  });

  describe("pathToName", () => {
    it("should take a path and a object with the `rootSource` key, and returns a valid symbol", () => {
      expect(
        utils.pathToName("a/b/c/d.ext", { rootSource: "a" } as SheerConfig)
      ).toBe("b.c.d");

      expect(
        utils.pathToName("src/lang/core.ext", {
          rootSource: "src"
        } as SheerConfig)
      ).toBe("lang.core");
    });
  });

  describe("nameToPath", () => {
    it("should take a name and object with the `rootSource` key, and returns the path of that name", () => {
      expect(
        utils.nameToPath("b.c.d", { rootSource: "a" } as SheerConfig)
      ).toBe("a/b/c/d.sheer");

      expect(
        utils.nameToPath("lang.core", { rootSource: "src" } as SheerConfig)
      ).toBe("src/lang/core.sheer");
    });
  });

  describe("pathNoExt", () => {
    it("should take a path and returns that path without the extension of the file", () => {
      expect(utils.pathNoExt("a/b/c.d")).toBe("a/b/c");
    });
  });
});
