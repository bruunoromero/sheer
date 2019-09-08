import { IrNode } from "./node";
import {
  ExPrimitveNode,
  ExStringNode,
  ExBoolNode,
  ExNumberNode,
  ExNullNode,
  ExSymbolNode,
  ExKeywordNode
} from "../../expander/ast/primitives";
import { IrType } from "../types";

export abstract class IrPrimitiveNode<T> extends IrNode {
  value: T;

  constructor(node: ExPrimitveNode<T>, type: IrType) {
    super(node.loc, type);
    this.value = node.value;
  }
}

export class IrStringNode extends IrPrimitiveNode<string> {
  constructor(node: ExStringNode | ExKeywordNode) {
    super(node, IrType.STRING);
  }

  static fromIrNode(node: IrNode, value: string) {
    const exNode = new ExStringNode(node.loc, value);
    return new IrStringNode(exNode);
  }
}

export class IrSymbolNode extends IrPrimitiveNode<string> {
  constructor(node: ExSymbolNode, value?: string) {
    super(node, IrType.SYMBOL);
    if (value) {
      this.value = value;
    }
  }

  static fromIrNode(node: IrNode, value: string) {
    const exNode = new ExSymbolNode(node.loc, value);
    return new IrSymbolNode(exNode);
  }
}

export class IrNumberNode extends IrPrimitiveNode<number> {
  constructor(node: ExNumberNode) {
    super(node, IrType.NUMBER);
  }
}

export class IrBoolNode extends IrPrimitiveNode<boolean> {
  constructor(node: ExBoolNode) {
    super(node, IrType.BOOL);
  }
}

export class IrNullNode extends IrPrimitiveNode<null> {
  constructor(node: ExNullNode) {
    super(node, IrType.NULL);
  }
}
