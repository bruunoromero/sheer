import { AExTraverser } from "./atraverser";
import { ParserMap } from "../../parser/ast";
import { ExMapNode } from "../ast/primitives";

export class ExMapTraverser extends AExTraverser {
  traverse(node: ParserMap): ExMapNode {
    const value = node.value.map(([key, value]) => [
      this.traverser.traverseAndValidate(key),
      this.traverser.traverseAndValidate(value)
    ]);

    return new ExMapNode(node.loc, value);
  }
}
