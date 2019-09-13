import { AIrTraverser } from "./atraverser";
import { ExRequireNode } from "../../expander/ast/require";
import { IrContext } from "../contex";
import { IrNode, IrExpressionNode } from "../ast/node";
import { IrRequireNode } from "../ast/require";
import { IrSymbolNode, IrStringNode } from "../ast/primitives";
import { IrVectorNode } from "../ast/vector";
import { ExType } from "../../expander/types";
import {
  ExStringNode,
  ExKeywordNode,
  ExSymbolNode
} from "../../expander/ast/primitives";

export class IrRequireTraverser extends AIrTraverser<ExRequireNode> {
  traverse(ctx: IrContext, node: ExRequireNode): IrNode {
    const req = new IrRequireNode(
      node.loc,
      new IrSymbolNode(node.ns, node.ns.value),
      node.as && new IrSymbolNode(node.as, node.as.value),
      node.refer.type === ExType.STRING
        ? new IrStringNode(node.refer as ExKeywordNode)
        : (node.refer.value as ExSymbolNode[]).map(
            node => new IrSymbolNode(node, node.value)
          )
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
