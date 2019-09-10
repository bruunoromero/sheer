import { AIrTraverser } from "./atraverser";
import { ExMapNode } from "../../expander/ast/primitives";
import { IrContext } from "../contex";
import { IrMapNode } from "../ast/map";

export class IrMapTraverser extends AIrTraverser<ExMapNode> {
  traverse(ctx: IrContext, node: ExMapNode): IrMapNode {
    return new IrMapNode(
      node.loc,
      node.value.map(([key, value]) => [
        this.traverser.traverseAndValidate(ctx, key).toExpression(),
        this.traverser.traverseAndValidate(ctx, value).toExpression()
      ])
    );
  }
}
