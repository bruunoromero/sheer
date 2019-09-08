import { IrNode, IrExpressionNode } from "./node";
import { IrType } from "../types";
import { Location } from "../../parser/ast";

export class IrIfNode extends IrNode {
  constructor(
    loc: Location,
    public readonly cond: IrExpressionNode,
    public readonly truthy: IrExpressionNode,
    public readonly falsy: IrExpressionNode
  ) {
    super(loc, IrType.IF);
  }
}
