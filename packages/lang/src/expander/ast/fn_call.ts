import { ExNode } from "./node";
import { ExType } from "../types";
import { Location } from "../../parser/ast";

export class ExFnCallNode extends ExNode {
  constructor(
    loc: Location,
    public readonly callee: ExNode,
    public readonly args: ExNode[]
  ) {
    super(loc, ExType.FN_CALL);
  }
}
