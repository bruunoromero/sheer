import { AExTraverser } from "./atraverser";
import { ParserSymbol } from "../../parser/ast";
import { ExSymbolNode } from "../ast/primitives";
import { ExMemberNode } from "../ast/member";

export class ExSymbolTraverser extends AExTraverser {
  traverse(node: ParserSymbol): ExSymbolNode | ExMemberNode {
    const parts = node.value.split("/");

    if (parts[0] && parts[1]) {
      return new ExMemberNode(
        node.loc,
        new ExSymbolNode(node.loc, parts[0]),
        new ExSymbolNode(node.loc, parts.slice(1).join("/"))
      );
    }

    return new ExSymbolNode(node.loc, node.value);
  }
}
