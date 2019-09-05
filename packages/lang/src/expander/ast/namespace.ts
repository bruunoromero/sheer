import { ExNode } from "./node";
import { Location } from "../../parser/ast";
import { ExSymbolNode, ExVectorNode } from "./primitives";
import { ExType } from "../types";

export class ExNamespaceNode extends ExNode {
  constructor(
    loc: Location,
    public readonly name: ExSymbolNode,
    public readonly imports: ExVectorNode[],
    public readonly requires: ExVectorNode[]
  ) {
    super(loc, ExType.NS);
  }
}
