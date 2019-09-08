import { IrNode, IrExpressionNode } from "./node";
import { Location } from "../../parser/ast";
import { IrType } from "../types";

export class IrFnCallNode extends IrNode {
  constructor(
    loc: Location,
    public readonly callee: IrExpressionNode,
    public readonly args: IrExpressionNode[]
  ) {
    super(loc, IrType.FN_CALL);
  }
}
