import { ATraverser } from "./atraverser";
import { ParserList, ParserSymbol } from "../../parser/ast";
import { ExNativeCallNode } from "../ast/native_call";
import { ExSymbolNode } from "../ast/primitives";

export class NativeCallTraverser extends ATraverser {
  traverse(node: ParserList): ExNativeCallNode {
    const args = this.args(node);
    const callee = this.traverser.traverseAndValidate(args[0]);
    const fnParserSymbol = node.value[0] as ParserSymbol;
    const fnNode = this.traverser.traverseAndValidate(
      fnParserSymbol
    ) as ExSymbolNode;

    const callArgs = this.traverseArgs(args.slice(1));

    return new ExNativeCallNode(node.loc, callee, fnNode, callArgs);
  }

  validate(node: ParserList): boolean {
    return this.validateMinLength(node, 1);
  }
}
