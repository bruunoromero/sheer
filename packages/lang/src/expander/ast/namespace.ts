import { ExNode } from "./node";
import { Location } from "../../parser/ast";
import {
  ExSymbolNode,
  ExVectorNode,
  ExStringNode,
  ExKeywordNode
} from "./primitives";
import { ExType } from "../types";

import { ExImportNode } from "./import";
import { ExRequireNode } from "./require";
import { chunks } from "../../utils";

export class ExNamespaceNode extends ExNode {
  constructor(
    loc: Location,
    public readonly name: ExSymbolNode,
    public readonly imports: ExVectorNode[],
    public readonly requires: ExVectorNode[]
  ) {
    super(loc, ExType.NS);
  }

  buildImports(): ExImportNode[] {
    return this.imports.map(imp => {
      return new ExImportNode(
        this.loc,
        imp.value[0] as ExStringNode,
        imp.value[2] as ExSymbolNode
      );
    });
  }

  buildRequires(): ExRequireNode[] {
    return this.requires.map(req => {
      const params = chunks(req.value.slice(1), 2);

      const maybeAs = params.filter(
        (group: [ExKeywordNode, ExNode]) => group[0].value === "as"
      )[0] as [ExKeywordNode, ExSymbolNode];

      const maybeRefer = params.filter(
        (group: [ExKeywordNode, ExNode]) => group[0].value === "refer"
      )[0] as [ExKeywordNode, ExVectorNode];

      const as_ = maybeAs ? maybeAs[1] : null;
      const refer = maybeRefer ? maybeRefer[1] : null;

      return new ExRequireNode(
        this.loc,
        req.value[0] as ExSymbolNode,
        as_,
        refer
      );
    });
  }
}
