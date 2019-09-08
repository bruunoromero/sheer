import { ExMemberNode } from "../../expander/ast/member";
import { AIrTraverser } from "./atraverser";
import { IrContext } from "../contex";
import { IrNode, IrExpressionNode } from "../ast/node";
import { IrMemberNode } from "../ast/member";

export class IrMemberTraverser extends AIrTraverser<ExMemberNode> {
  traverse(ctx: IrContext, node: ExMemberNode): IrNode {
    return new IrMemberNode(
      node.loc,
      this.traverser.traverseAndValidate(ctx, node.owner) as IrExpressionNode,
      this.traverser.traverseAndValidate(ctx, node.prop)
    );
  }
}
