import { ExNode } from "./node";
import { Location } from "../../parser/ast";
import { ExSymbolNode, ExVectorNode, ExKeywordNode } from "./primitives";
import { ExType } from "../types";

export class ExRequireNode extends ExNode {
  constructor(
    loc: Location,
    public readonly ns: ExSymbolNode,
    public readonly as: ExSymbolNode | null,
    public readonly refer: ExVectorNode | ExKeywordNode | null
  ) {
    super(loc, ExType.REQUIRE);
  }
}
