import {
  ParserBool,
  ParserConcreteNode,
  ParserKeyword,
  ParserList,
  ParserNull,
  ParserNumber,
  ParserString,
  ParserSymbol,
  ParserVector
} from "../../parser/ast";
import { ParserType } from "../../parser/types";
import { ExNode } from "../ast/node";
import {
  ExBoolNode,
  ExKeywordNode,
  ExNullNode,
  ExNumberNode,
  ExStringNode,
  ExSymbolNode
} from "../ast/primitives";
import { ATraverser } from "./atraverser";
import { ListTraverser } from "./list";
import { VectorTraverser } from "./vector";

export class Traverser extends ATraverser {
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
        return new ExSymbolNode(node.loc, node.value as string);
      case ParserType.LIST:
        return new ListTraverser(this.validator, this).traverseAndValidate(
          node as ParserList
        );
      case ParserType.VECTOR:
        return new VectorTraverser(this.validator, this).traverseAndValidate(
          node as ParserVector
        );
    }

    throw new Error(`could not traverse type ${node.type}`);
  }
}
