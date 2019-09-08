import { ParserList } from "../../parser/ast";
import * as utils from "../../utils";
import { ExNode } from "../ast/node";
import { ExKeywordNode, ExVectorNode, ExSymbolNode } from "../ast/primitives";

import { AExTraverser } from "./atraverser";
import { ExRequireNode } from "../ast/require";
import { ParserType } from "../../parser/types";

export class ExRequireTraverser extends AExTraverser {
  get fnName() {
    return "require";
  }

  traverse(node: ParserList): ExRequireNode {
    const args = this.args(node);

    const requiresVector = this.traverser.traverseAndValidate(
      args[0]
    ) as ExVectorNode;

    const [ns, ...rest] = requiresVector.value;

    const grouppedRest = utils.chunks(rest, 2);

    const maybeAs = grouppedRest.filter(
      (group: [ExKeywordNode, ExNode]) => group[0].value === "as"
    )[0] as [ExKeywordNode, ExSymbolNode];

    const maybeRefer = grouppedRest.filter(
      (group: [ExKeywordNode, ExNode]) => group[0].value === "refer"
    )[0] as [ExKeywordNode, ExVectorNode];

    const as_ = maybeAs ? maybeAs[1] : null;
    const refer = maybeRefer ? maybeRefer[1] : null;

    return new ExRequireNode(node.loc, ns as ExSymbolNode, as_, refer);
  }

  validate(node: ParserList): boolean {
    const args = this.args(node);

    return this.manyValidations(
      () => this.validateEqualLength(node, 1),
      () => this.invalidTypeProvided(args[0], ParserType.VECTOR)
    );
  }
}
