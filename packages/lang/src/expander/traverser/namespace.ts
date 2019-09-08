import { AExTraverser } from "./atraverser";
import { ParserList } from "../../parser/ast";
import { ExNamespaceNode } from "../ast/namespace";
import * as utils from "../../utils";
import { ExSymbolNode, ExVectorNode, ExKeywordNode } from "../ast/primitives";

export class ExNamespaceTraverser extends AExTraverser {
  get fnName() {
    return "ns";
  }

  traverse(node: ParserList): ExNamespaceNode {
    const args = this.args(node);
    const [name, ...params] = this.traverseArgs(args);
    const traversedParams = utils.chunks(params, 2) as [
      [ExKeywordNode, ExVectorNode]
    ];

    const imports = traversedParams.filter(el => el[0].value === "import")[0];
    const requires = traversedParams.filter(el => el[0].value === "require")[0];

    let importsVector = [];
    let requiresVector = [];

    if (imports) {
      importsVector = imports[1].value;
    }

    if (requires) {
      requiresVector = requires[1].value;
    }

    return new ExNamespaceNode(
      node.loc,
      name as ExSymbolNode,
      importsVector,
      requiresVector
    );
  }
}
