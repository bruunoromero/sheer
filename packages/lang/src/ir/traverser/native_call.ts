import { AIrTraverser } from "./atraverser";
import { ExNativeCallNode } from "../../expander/ast/native_call";
import { IrContext } from "../contex";
import { IrNativeCallNode } from "../ast/native_call";
import { IrSymbolNode } from "../ast/primitives";
import { IrExpressionNode } from "../ast/node";

export class IrNativeCallTraverse extends AIrTraverser<ExNativeCallNode> {
  traverse(ctx: IrContext, node: ExNativeCallNode): IrNativeCallNode {
    return new IrNativeCallNode(
      node.loc,
      this.traverser.traverseAndValidate(ctx, node.callee) as IrExpressionNode,
      new IrSymbolNode(node.fn),
      node.args.map(
        node =>
          this.traverser.traverseAndValidate(ctx, node) as IrExpressionNode
      )
    );
  }
}
