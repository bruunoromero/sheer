import { IrNode } from "./node";
import { Location } from "../../parser/ast";
import { IrType } from "../types";
import { IrSymbolNode, IrStringNode } from "./primitives";

export class IrImportNode extends IrNode {
  constructor(
    loc: Location,
    public readonly path: IrStringNode,
    public readonly as: IrSymbolNode | null
  ) {
    super(loc, IrType.IMPORT);
  }
}
