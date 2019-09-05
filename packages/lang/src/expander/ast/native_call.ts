import { ExNode } from "./node";
import { ExSymbolNode } from "./primitives";
import { Location } from "../../parser/ast";
import { ExType } from "../types";

export class ExNativeCallNode extends ExNode {
  constructor(
    loc: Location,
    public readonly callee: ExNode,
    public readonly fn: ExSymbolNode,
    public readonly args: ExNode[]
  ) {
    super(loc, ExType.NATIVE_CALL);
  }
}
