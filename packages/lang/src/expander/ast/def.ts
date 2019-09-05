import { Location } from "../../parser/ast";
import { ExType } from "../types";
import { ExNode } from "./node";
import { ExSymbolNode } from "./primitives";

export class ExDefNode extends ExNode {
  constructor(
    loc: Location,
    public readonly name: ExSymbolNode,
    public readonly value: ExNode,
    public readonly isPrivate: boolean
  ) {
    super(loc, ExType.DEF);
  }
}
