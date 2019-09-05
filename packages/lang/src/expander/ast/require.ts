import { ExNode } from "./node";
import { Location } from "../../parser/ast";
import { ExSymbolNode, ExVectorNode } from "./primitives";
import { ExType } from "../types";

export class IrRequireNode extends ExNode {
  constructor(
    loc: Location,
    public readonly ns: ExSymbolNode,
    public readonly as: ExSymbolNode,
    public readonly refer: ExVectorNode
  ) {
    super(loc, ExType.REQUIRE);
  }
}
