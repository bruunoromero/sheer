import { IrNode, IrExpressionNode } from "./node";
import { Location } from "../../parser/ast";
import { IrSymbolNode } from "./primitives";
import { IrType } from "../types";

export class IrNativeCallNode extends IrNode {
  constructor(
    loc: Location,
    public readonly callee: IrExpressionNode,
    public readonly fn: IrSymbolNode,
    public readonly args: IrExpressionNode[]
  ) {
    super(loc, IrType.NATIVE_CALL);
  }
}
