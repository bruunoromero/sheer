import { ParserList } from "../../parser/ast";
import { ExDefNode } from "../ast/def";
import { ExFnTraverser } from "./fn";
import { ExDefTraverser } from "./def";
import { ExSymbolNode } from "../ast/primitives";
import { ParserType } from "../../parser/types";

export class ExDefnTraverser extends ExDefTraverser {
  get fnName(): string {
    return this.isPrivate ? "defn-" : "defn";
  }

  traverse(node: ParserList): ExDefNode {
    const args = this.args(node);
    const [sym, ...rest] = args;
    const name = this.traverser.traverseAndValidate(sym) as ExSymbolNode;

    const value = new ExFnTraverser(
      this.validator,
      this.traverser
    ).transformWithLoc(node.loc, rest);

    return new ExDefNode(node.loc, name, value, this.isPrivate);
  }

  validate(node: ParserList): boolean {
    const args = this.args(node);

    return this.manyValidations(
      () => this.validateMinLength(node, 3),
      () => this.invalidTypeProvided(args[0], ParserType.SYMBOL),
      () => this.invalidTypeProvided(args[1], ParserType.VECTOR)
    );
  }
}
