import { ParserList } from "../../parser/ast";
import { ParserType } from "../../parser/types";
import { ExNode } from "../ast/node";
import { ExVectorNode } from "../ast/primitives";
import { AExTraverser } from "./atraverser";
import { ExDefTraverser } from "./def";
import { ExDefnTraverser } from "./defn";
import { ExFnTraverser } from "./fn";
import { ExFnCallTraverser } from "./fn_call";
import { ExIfTraverser } from "./if";
import { ExImportTraverser } from "./import";
import { ExKeywordCallTraverser } from "./keyword_call";
import { ExLogOpTraverser } from "./log_op";
import { ExNamespaceTraverser } from "./namespace";
import { ExNativeCallTraverser } from "./native_call";
import { ExRequireTraverser } from "./require";
import { ExWhenTraverser } from "./when";
import { ExLetTraverser } from "./let";

export class ExListTraverser extends AExTraverser {
  traverse(node: ParserList): ExNode {
    const firstEl = node.value[0];

    if (!firstEl) return new ExVectorNode(node.loc, []);

    if (firstEl.type === ParserType.KEYWORD) {
      return new ExKeywordCallTraverser(
        this.validator,
        this.traverser
      ).traverseAndValidate(node);
    }

    if (firstEl.value[0] === ".") {
      return new ExNativeCallTraverser(
        this.validator,
        this.traverser
      ).traverseAndValidate(node);
    }

    switch (firstEl.value) {
      case "ns":
        return new ExNamespaceTraverser(
          this.validator,
          this.traverser
        ).traverseAndValidate(node);
      case "fn":
        return new ExFnTraverser(
          this.validator,
          this.traverser
        ).traverseAndValidate(node);
      case "def":
        return new ExDefTraverser(
          false,
          this.validator,
          this.traverser
        ).traverseAndValidate(node);
      case "def-":
        return new ExDefTraverser(
          true,
          this.validator,
          this.traverser
        ).traverseAndValidate(node);
      case "defn":
        return new ExDefnTraverser(
          false,
          this.validator,
          this.traverser
        ).traverseAndValidate(node);
      case "defn-":
        return new ExDefnTraverser(
          false,
          this.validator,
          this.traverser
        ).traverseAndValidate(node);
      case "if":
        return new ExIfTraverser(
          this.validator,
          this.traverser
        ).traverseAndValidate(node);
      case "when":
        return new ExWhenTraverser(
          this.validator,
          this.traverser
        ).traverseAndValidate(node);
      case "and":
        return new ExLogOpTraverser(
          "&&",
          this.validator,
          this.traverser
        ).traverseAndValidate(node);
      case "or":
        return new ExLogOpTraverser(
          "||",
          this.validator,
          this.traverser
        ).traverseAndValidate(node);
      case "let":
        return new ExLetTraverser(
          this.validator,
          this.traverser
        ).traverseAndValidate(node);
      case "require":
        return new ExRequireTraverser(
          this.validator,
          this.traverser
        ).traverseAndValidate(node);
      case "import":
        return new ExImportTraverser(
          this.validator,
          this.traverser
        ).traverseAndValidate(node);
      default:
        return new ExFnCallTraverser(
          this.validator,
          this.traverser
        ).traverseAndValidate(node);
    }
  }
}
