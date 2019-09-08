import { AIrTraverser } from "./atraverser";
import { ExLogOpNode } from "../../expander/ast/log_op";
import { IrContext } from "../contex";
import { IrLogOpNode } from "../ast/log_op";

export class IrLogOpTraverser extends AIrTraverser<ExLogOpNode> {
  traverse(ctx: IrContext, node: ExLogOpNode): IrLogOpNode {
    return new IrLogOpNode(
      node.loc,
      this.traverser.traverseAndValidate(ctx, node.left),
      this.traverser.traverseAndValidate(ctx, node.right),
      node.op
    );
  }
}
