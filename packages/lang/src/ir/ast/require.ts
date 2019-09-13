import { IrNode } from "./node";
import { Location } from "../../parser/ast";
import { IrType } from "../types";
import { IrVectorNode } from "./vector";
import { IrSymbolNode, IrStringNode } from "./primitives";

export class IrRequireNode extends IrNode {
  constructor(
    loc: Location,
    public readonly ns: IrSymbolNode,
    public readonly as: IrSymbolNode | null,
    public readonly refer: IrSymbolNode[] | IrStringNode | null
  ) {
    super(loc, IrType.REQUIRE);
  }
}
