import { IrNode } from "./node";
import { Location } from "../../parser/ast";
import { IrType } from "../types";

export class IrLogOpNode extends IrNode {
  constructor(
    loc: Location,
    public readonly left: IrNode,
    public readonly right: IrNode,
    public readonly op: string
  ) {
    super(loc, IrType.LOG_OP);
  }
}
