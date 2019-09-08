import { AIrTraverser } from "./atraverser";
import { ExRequireNode } from "../../expander/ast/require";
import { IrContext } from "../contex";
import { IrNode, IrExpressionNode } from "../ast/node";
import { IrRequireNode } from "../ast/require";
import { IrSymbolNode, IrStringNode } from "../ast/primitives";
import { IrVectorNode } from "../ast/vector";

export class IrRequireTraverser extends AIrTraverser<ExRequireNode> {
  traverse(ctx: IrContext, node: ExRequireNode): IrNode {
    const req = new IrRequireNode(
      node.loc,
      this.traverser.traverseAndValidate(ctx, node.ns) as IrSymbolNode,
      this.traverser.traverseAndValidate(ctx, node.as) as IrSymbolNode,
      (this.traverser.traverseAndValidate(ctx, node.refer) as IrExpressionNode)
        .value as IrVectorNode | IrStringNode
    );

    ctx.addLocalRequirement(node.ns.value, req);

    return req;
  }

  validate(ctx: IrContext, node: ExRequireNode): boolean {
    if (ctx.hasLocalRequirement(node.ns.value)) {
      this.validator.addError(
        node.loc,
        `namespace ${node.ns.value} already required`
      );

      return false;
    }

    return true;
  }
}
