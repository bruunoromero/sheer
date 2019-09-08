import { IrNode, IrExpressionNode } from "./node";
import { Location } from "../../parser/ast";
import { IrType } from "../types";

export class IrMemberNode extends IrNode {
  constructor(
    loc: Location,
    public readonly owner: IrExpressionNode,
    public readonly prop: IrNode
  ) {
    super(loc, IrType.MEMBER);
  }
}
