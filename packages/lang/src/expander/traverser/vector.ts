import { AExTraverser } from "./atraverser";
import { ExVectorNode } from "../ast/primitives";
import { ParserVector } from "../../parser/ast";

export class ExVectorTraverser extends AExTraverser {
  traverse(node: ParserVector): ExVectorNode {
    const mValue = node.value.map(el => this.traverser.traverseAndValidate(el));

    return new ExVectorNode(node.loc, mValue);
  }
}
