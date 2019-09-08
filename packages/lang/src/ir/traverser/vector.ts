import { AIrTraverser } from "./atraverser";
import { ExVectorNode } from "../../expander/ast/primitives";
import { IrContext } from "../contex";
import { IrVectorNode } from "../ast/vector";

export class IrVectorTraverser extends AIrTraverser<ExVectorNode> {
  traverse(ctx: IrContext, node: ExVectorNode): IrVectorNode {
    return new IrVectorNode(
      node.loc,
      node.value.map(node =>
        this.traverser.traverseAndValidate(ctx, node).toExpression()
      )
    );
  }
}
