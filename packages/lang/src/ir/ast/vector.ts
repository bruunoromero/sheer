import { Location } from "../../parser/ast";
import { IrType } from "../types";
import { IrNode, IrExpressionNode } from "./node";

export class IrVectorNode extends IrNode {
  constructor(loc: Location, public readonly value: IrExpressionNode[]) {
    super(loc, IrType.VECTOR);
  }
}
