import { AExTraverser } from "./atraverser";
import { ParserList } from "../../parser/ast";
import { ExNode } from "../ast/node";
import { ExBoolNode } from "../ast/primitives";
import { ExLogOpNode } from "../ast/log_op";
import { Validator } from "../../validator";
import { ExTraverser } from ".";

export class ExLogOpTraverser extends AExTraverser {
  constructor(
    private readonly op: string,
    protected readonly validator: Validator,
    protected readonly traverser: ExTraverser
  ) {
    super(validator, traverser);
  }

  traverse(node: ParserList): ExNode {
    const args = this.args(node);
    const traversedArgs = this.traverseArgs(args);

    if (traversedArgs.length === 0) {
      return new ExBoolNode(node.loc, true);
    }

    if (traversedArgs.length === 1) {
      return traversedArgs[0];
    }

    return this.buildManyOp(node, traversedArgs);
  }

  buildManyOp(node: ParserList, args: ExNode[]): ExLogOpNode {
    if (args.length > 2) {
      return new ExLogOpNode(
        node.loc,
        args[0],
        this.buildManyOp(node, args.slice(1)),
        this.op
      );
    }

    return new ExLogOpNode(node.loc, args[0], args[1], this.op);
  }
}
