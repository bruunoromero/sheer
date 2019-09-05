import { ATraverser } from "./atraverser";
import { ParserList } from "../../parser/ast";

import { ExNode } from "../ast/node";
import { ExFnCallNode } from "../ast/fn_call";

export class FnCallTraverser extends ATraverser {
  traverse(node: ParserList): ExNode {
    const callee = this.traverser.traverseAndValidate(node.value[0]);

    return new ExFnCallNode(
      node.loc,
      callee,
      this.traverseArgs(node.value.slice(1))
    );
  }
}
