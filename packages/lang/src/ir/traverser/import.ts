import { AIrTraverser } from "./atraverser";
import { ExImportNode } from "../../expander/ast/import";
import { IrContext } from "../contex";
import { IrImportNode } from "../ast/import";
import { IrSymbolNode, IrStringNode } from "../ast/primitives";

export class IrImportTraverser extends AIrTraverser<ExImportNode> {
  traverse(ctx: IrContext, node: ExImportNode): IrImportNode {
    const imp = new IrImportNode(
      node.loc,
      new IrStringNode(node.path),
      new IrSymbolNode(node.as)
    );

    ctx.addLocalImport(node.path.value, imp);

    return imp;
  }

  validate(ctx: IrContext, node: ExImportNode): boolean {
    if (ctx.hasLocalImport(node.path.value)) {
      this.validator.addError(
        node.loc,
        `namespace ${node.path.value} already imported`
      );
      return false;
    }

    return true;
  }
}
