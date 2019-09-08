import { ExNamespaceNode } from "../../expander/ast/namespace";
import { IrErrorNode } from "../ast/node";
import { IrContext } from "../contex";
import { AIrTraverser } from "./atraverser";

export class IrNamespaceTraverser extends AIrTraverser<ExNamespaceNode> {
  traverse(ctx: IrContext, node: ExNamespaceNode): IrErrorNode {
    return new IrErrorNode();
  }

  validate(ctx: IrContext, node: ExNamespaceNode) {
    // return false;
    return true;
  }
}
