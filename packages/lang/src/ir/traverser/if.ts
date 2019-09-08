import { AIrTraverser } from "./atraverser";
import { ExIfNode } from "../../expander/ast/if";
import { IrContext } from "../contex";
import { IrNode } from "../ast/node";
import { IrIfNode } from "../ast/if";

export class IrIfTraverser extends AIrTraverser<ExIfNode> {
  traverse(ctx: IrContext, node: ExIfNode): IrIfNode {
    return new IrIfNode(
      node.loc,
      this.traverser.traverseAndValidate(ctx, node.cond).toExpression(),
      this.traverser.traverseAndValidate(ctx, node.truthy).toExpression(),
      this.traverser.traverseAndValidate(ctx, node.falsy).toExpression()
    );
  }
}
