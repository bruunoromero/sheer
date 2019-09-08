import { Location } from "../../parser/ast";
import { IrType } from "../types";

export abstract class IrNode {
  constructor(public readonly loc: Location, public readonly type: IrType) {}

  toExpression(): IrExpressionNode {
    if (this.type === IrType.EXPRESSION) {
      return (this as any) as IrExpressionNode;
    }

    return new IrExpressionNode(this.loc, this);
  }
}

export class IrErrorNode extends IrNode {
  constructor() {
    super(
      { start: { column: 0, line: 0 }, end: { column: 0, line: 0 } },
      IrType.ERROR
    );
  }
}

export class IrExpressionNode extends IrNode {
  constructor(loc: Location, public readonly value: IrNode) {
    super(loc, IrType.EXPRESSION);
  }
}
