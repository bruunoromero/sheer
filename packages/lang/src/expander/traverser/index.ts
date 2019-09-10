import {
  ParserConcreteNode,
  ParserList,
  ParserSymbol,
  ParserVector,
  ParserMap
} from "../../parser/ast";
import { ParserType } from "../../parser/types";
import { ExNode } from "../ast/node";
import {
  ExBoolNode,
  ExKeywordNode,
  ExNullNode,
  ExNumberNode,
  ExStringNode
} from "../ast/primitives";
import { AExTraverser } from "./atraverser";
import { ExListTraverser } from "./list";
import { ExSymbolTraverser } from "./symbol";
import { ExVectorTraverser } from "./vector";
import { ExMapTraverser } from "./map";

export class ExTraverser extends AExTraverser {
  traverse(node: ParserConcreteNode): ExNode {
    switch (node.type) {
      case ParserType.NULL:
        return new ExNullNode(node.loc);
      case ParserType.BOOL:
        return new ExBoolNode(node.loc, node.value as boolean);
      case ParserType.STRING:
        return new ExStringNode(node.loc, node.value as string);
      case ParserType.NUMBER:
        return new ExNumberNode(node.loc, node.value as number);
      case ParserType.KEYWORD:
        return new ExKeywordNode(node.loc, node.value as string);
      case ParserType.SYMBOL:
        return new ExSymbolTraverser(this.validator, this).traverseAndValidate(
          node as ParserSymbol
        );
      case ParserType.LIST:
        return new ExListTraverser(this.validator, this).traverseAndValidate(
          node as ParserList
        );
      case ParserType.VECTOR:
        return new ExVectorTraverser(this.validator, this).traverseAndValidate(
          node as ParserVector
        );
      case ParserType.MAP:
        return new ExMapTraverser(this.validator, this).traverseAndValidate(
          node as ParserMap
        );
    }

    throw new Error(`could not traverse type ${node.type}`);
  }
}
