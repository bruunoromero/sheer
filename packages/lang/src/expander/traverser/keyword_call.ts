import { ParserList } from "../../parser/ast";
import { ExMemberNode } from "../ast/member";
import { AExTraverser } from "./atraverser";

export class ExKeywordCallTraverser extends AExTraverser {
  get fnName() {
    return ""
  }
  
  traverse(node: ParserList): ExMemberNode {
    const args = this.args(node);
    const prop = this.traverser.traverseAndValidate(node.value[0]);
    const owner = this.traverser.traverseAndValidate(args[0]);

    return new ExMemberNode(node.loc, owner, prop);
  }

  validate(node: ParserList): boolean {
    return this.validateEqualLength(node, 1);
  }
}
