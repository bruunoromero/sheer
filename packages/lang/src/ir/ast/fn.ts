import { IrNode, IrExpressionNode } from "./node";
import { IrSymbolNode } from "./primitives";
import { Location } from "../../parser/ast";
import { IrType } from "../types";
import { IrContext } from "../contex";

export class IrFnNode extends IrNode {
  constructor(
    loc: Location,
    public readonly body: IrExpressionNode[],
    public readonly params: IrSymbolNode[],
    public readonly isRest: boolean,
    public readonly ctx: IrContext
  ) {
    super(loc, IrType.FN);
  }

  toJSON() {
    return {
      loc: this.loc,
      body: this.body,
      params: this.params,
      isRest: this.isRest
    };
  }
}
