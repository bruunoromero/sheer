import { AIrTraverser } from "./atraverser";
import { ExDefNode } from "../../expander/ast/def";
import { IrContext } from "../contex";
import { IrDefNode } from "../ast/def";
import { IrSymbolNode } from "../ast/primitives";
import { IrExpressionNode } from "../ast/node";

export class IrDefTraverser extends AIrTraverser<ExDefNode> {
  traverse(ctx: IrContext, node: ExDefNode): IrDefNode {
    const def = new IrDefNode(
      node.loc,
      new IrSymbolNode(node.name),
      this.traverser.traverseAndValidate(ctx, node.value) as IrExpressionNode,
      node.isPrivate
    );

    ctx.addGlobalDefinition(node.name.value, def);

    return def;
  }

  validate(ctx: IrContext, node: ExDefNode): boolean {
    if (!ctx.isRoot()) {
      this.validator.addError(
        node.name.loc,
        `cannot define a symbol outside of the global scope`
      );

      return false;
    }

    if (ctx.hasLocalDefinition(node.name.value)) {
      this.validator.addError(
        node.name.loc,
        `symbol ${node.name.value} already defined`
      );
    }

    return true;
  }
}
