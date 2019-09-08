import { ExNode } from "./node";
import { Location } from "../../parser/ast";
import { ExType } from "../types";
import { ExSymbolNode } from "./primitives";

export class ExFnNode extends ExNode {
  constructor(
    loc: Location,
    public readonly body: ExNode[],
    public readonly params: ExSymbolNode[],
    public readonly isRest: boolean
  ) {
    super(loc, ExType.FN);
  }
}
