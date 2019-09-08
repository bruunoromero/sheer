import { ParserList } from "../../parser/ast";
import * as utils from "../../utils";
import { ExImportNode } from "../ast/import";
import {
  ExKeywordNode,
  ExStringNode,
  ExSymbolNode,
  ExVectorNode
} from "../ast/primitives";

import { AExTraverser } from "./atraverser";
import { ParserType } from "../../parser/types";

export class ExImportTraverser extends AExTraverser {
  get fnName(): string {
    return "import";
  }

  traverse(node: ParserList): ExImportNode {
    const args = this.args(node);

    const importStmt = this.traverser.traverseAndValidate(
      args[0]
    ) as ExVectorNode;

    const [path, ...opts] = importStmt.value;

    const grouppedOpts = utils.chunks(opts, 2) as [
      ExKeywordNode,
      ExSymbolNode
    ][];

    const maybeAs = grouppedOpts.filter(group => group[0].value === "as")[0];

    const as_ = maybeAs ? maybeAs[1] : null;

    return new ExImportNode(node.loc, path as ExStringNode, as_);
  }

  validate(node: ParserList): boolean {
    const args = this.args(node);

    return this.manyValidations(
      () => this.validateEqualLength(node, 1),
      () => this.invalidTypeProvided(args[0], ParserType.VECTOR)
    );
  }
}
