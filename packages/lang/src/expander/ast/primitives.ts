import { Location } from "../../parser/ast";

import { ExNode } from "./node";
import { ExType } from "../types";

export abstract class ExPrimitveNode<T> extends ExNode {
  value: T;

  constructor(loc: Location, type: ExType, value?: T) {
    super(loc, type);

    this.value = value;
  }
}

export class ExNullNode extends ExPrimitveNode<null> {
  constructor(loc: Location) {
    super(loc, ExType.NULL, null);
  }
}

export class ExBoolNode extends ExPrimitveNode<boolean> {
  constructor(loc: Location, value: boolean) {
    super(loc, ExType.BOOL, value);
  }
}

export class ExStringNode extends ExPrimitveNode<string> {
  constructor(loc: Location, value: string) {
    super(loc, ExType.STRING, value);
  }
}

export class ExNumberNode extends ExPrimitveNode<number> {
  constructor(loc: Location, value: number) {
    super(loc, ExType.NUMBER, value);
  }
}

export class ExKeywordNode extends ExPrimitveNode<string> {
  constructor(loc: Location, value: string) {
    super(loc, ExType.KEYWORD, value);
  }
}

export class ExSymbolNode extends ExPrimitveNode<string> {
  constructor(loc: Location, value: string) {
    super(loc, ExType.SYMBOL, value);
  }
}

export class ExVectorNode extends ExPrimitveNode<ExNode[]> {
  constructor(loc: Location, value: ExNode[]) {
    super(loc, ExType.VECTOR, value);
  }
}

export class ExMapNode extends ExPrimitveNode<ExNode[][]> {
  constructor(loc: Location, value: ExNode[][]) {
    super(loc, ExType.MAP, value);
  }
}

export class ExSetNode extends ExPrimitveNode<ExNode[]> {
  constructor(loc: Location, value: ExNode[]) {
    super(loc, ExType.SET, value);
  }
}
