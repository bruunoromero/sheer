import { ATraverser } from "./atraverser";
import { ExVectorNode } from "../ast/primitives";
import { ParserVector } from "../../parser/ast";

export class VectorTraverser extends ATraverser {
  traverse(node: ParserVector): ExVectorNode {
    const mValue = node.value.map(el => this.traverser.traverseAndValidate(el));

    return new ExVectorNode(node.loc, mValue);
  }
}
