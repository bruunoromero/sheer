import { AIrTraverser } from "./atraverser";
import { ExFnCallNode } from "../../expander/ast/fn_call";
import { IrContext } from "../contex";
import { IrFnCallNode } from "../ast/fn_call";

export class IrFnCallTraverser extends AIrTraverser<ExFnCallNode> {
  traverse(ctx: IrContext, node: ExFnCallNode): IrFnCallNode {
    const callee = this.traverser
      .traverseAndValidate(ctx, node.callee)
      .toExpression();

    const args = node.args.map(node =>
      this.traverser.traverseAndValidate(ctx, node).toExpression()
    );

    return new IrFnCallNode(node.loc, callee, args);
  }
}
