import { IrContext } from "../contex";
import { ExNode } from "../../expander/ast/node";
import { Validator } from "../../validator";
import { IrNode, IrErrorNode } from "../ast/node";
import { IrTraverser } from ".";

export abstract class AIrTraverser<T extends ExNode> {
  constructor(
    public readonly validator: Validator,
    public readonly traverser?: IrTraverser
  ) {}

  abstract traverse(ctx: IrContext, node: T): IrNode;

  validate(ctx: IrContext, node: T): boolean {
    return true;
  }

  traverseAndValidate(ctx: IrContext, node: T) {
    if (this.validate(ctx, node)) {
      return this.traverse(ctx, node);
    }

    return new IrErrorNode();
  }
}
