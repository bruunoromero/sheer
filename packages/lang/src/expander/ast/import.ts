import { ExNode } from "./node";
import { ExType } from "../types";
import { Location } from "../../parser/ast";
import { ExStringNode, ExSymbolNode } from "./primitives";

export class ExImportNode extends ExNode {
  constructor(
    loc: Location,
    public readonly path: ExStringNode,
    public readonly as: ExSymbolNode | null
  ) {
    super(loc, ExType.IMPORT);
  }
}
