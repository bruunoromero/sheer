import { AExTraverser } from "./atraverser";
import { ParserList } from "../../parser/ast";
import { ExIfNode } from "../ast/if";

export class ExIfTraverser extends AExTraverser {
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
