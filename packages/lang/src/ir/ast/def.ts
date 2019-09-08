import { Location } from "../../parser/ast";
import { IrType } from "../types";
import { IrNode, IrExpressionNode } from "./node";
import { IrSymbolNode } from "./primitives";

export class IrDefNode extends IrNode {
  constructor(
    loc: Location,
    public readonly name: IrSymbolNode,
    public readonly value: IrExpressionNode,
    public readonly isPrivate: boolean
  ) {
    super(loc, IrType.DEF);
  }
}
