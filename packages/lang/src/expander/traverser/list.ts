import { ParserList } from "../../parser/ast";
import { ParserType } from "../../parser/types";
import { ExNode } from "../ast/node";
import { ATraverser } from "./atraverser";
import { FnTraverser } from "./fn";
import { FnCallTraverser } from "./fn_call";
import { NamespaceTraverser } from "./namespace";
import { ImportTraverser } from "./import";
import { KeywordCallTraverser } from "./keyword_call";
import { NativeCallTraverser } from "./native_call";
import { RequireTraverser } from "./require";
import { DefTraverser } from "./def";
import { DefnTraverser } from "./defn";
import { ExVectorNode } from "../ast/primitives";
import { IfTraverser } from "./if";
import { WhenTraverser } from "./when";
import { LogOpTraverser } from "./log_op";

export class ListTraverser extends ATraverser {
  traverse(node: ParserList): ExNode {
    const firstEl = node.value[0];

    if (!firstEl) return new ExVectorNode(node.loc, []);

    if (firstEl.type === ParserType.KEYWORD) {
      return new KeywordCallTraverser(
        this.validator,
        this.traverser
      ).traverseAndValidate(node);
    }

    if (firstEl.value[0] === ".") {
      return new NativeCallTraverser(
        this.validator,
        this.traverser
      ).traverseAndValidate(node);
    }

    switch (firstEl.value) {
      case "ns":
        return new NamespaceTraverser(
          this.validator,
          this.traverser
        ).traverseAndValidate(node);
      case "fn":
        return new FnTraverser(
          this.validator,
          this.traverser
        ).traverseAndValidate(node);
      case "def":
        return new DefTraverser(
          false,
          this.validator,
          this.traverser
        ).traverseAndValidate(node);
      case "def-":
        return new DefTraverser(
          true,
          this.validator,
          this.traverser
        ).traverseAndValidate(node);
      case "defn":
        return new DefnTraverser(
          false,
          this.validator,
          this.traverser
        ).traverseAndValidate(node);
      case "defn-":
        return new DefnTraverser(
          false,
          this.validator,
          this.traverser
        ).traverseAndValidate(node);
      case "if":
        return new IfTraverser(
          this.validator,
          this.traverser
        ).traverseAndValidate(node);
      case "when":
        return new WhenTraverser(
          this.validator,
          this.traverser
        ).traverseAndValidate(node);
      case "and":
        return new LogOpTraverser(
          "&&",
          this.validator,
          this.traverser
        ).traverseAndValidate(node);
      case "or":
        return new LogOpTraverser(
          "||",
          this.validator,
          this.traverser
        ).traverseAndValidate(node);
      case "require":
        return new RequireTraverser(
          this.validator,
          this.traverser
        ).traverseAndValidate(node);
      case "import":
        return new ImportTraverser(
          this.validator,
          this.traverser
        ).traverseAndValidate(node);
      default:
        return new FnCallTraverser(
          this.validator,
          this.traverser
        ).traverseAndValidate(node);
    }
  }
}
