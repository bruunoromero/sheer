import { ATraverser } from "./atraverser";
import { ParserList } from "../../parser/ast";
import { ExIfNode } from "../ast/if";

export class IfTraverser extends ATraverser {
  get fnName(): string {
    return "if";
  }

  traverse(node: ParserList): ExIfNode {
    const args = this.args(node);
    const [cond, truthy, falsy] = this.traverseArgs(args);

    return new ExIfNode(node.loc, cond, truthy, falsy);
  }

  validate(node: ParserList): boolean {
    return this.validateEqualLength(node, 3);
  }
}
