import { AIrTraverser } from "./atraverser";
import { ExFnNode } from "../../expander/ast/fn";
import { IrContext } from "../contex";
import { IrFnNode } from "../ast/fn";
import { IrSymbolNode } from "../ast/primitives";

export class IrFnTraverser extends AIrTraverser<ExFnNode> {
  traverse(ctx: IrContext, node: ExFnNode): IrFnNode {
    const params = node.params.map(node => new IrSymbolNode(node));

    params.forEach(p => ctx.addLocalDefinition(p.value, p));

    return new IrFnNode(
      node.loc,
      node.body.map(node =>
        this.traverser.traverseAndValidate(ctx, node).toExpression()
      ),
      params,
      node.isRest,
      ctx
    );
  }

  validate(ctx: IrContext, node: ExFnNode): boolean {
    const names = node.params.map(param => param.value);

    const hasDup = new Set(names).size !== names.length;

    if (hasDup) {
      this.validator.addError(node.loc, `duplicated parameter names`);
    }

    return !hasDup;
  }
}
