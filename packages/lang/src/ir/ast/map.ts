import { IrNode } from "./node";
import { IrType } from "../types";
import { Location } from "../../parser/ast";

export class IrMapNode extends IrNode {
  constructor(loc: Location, public readonly value: IrNode[][]) {
    super(loc, IrType.MAP);
  }
}
