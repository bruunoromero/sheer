import { ExTraverser } from ".";
import { ParserList } from "../../parser/ast";
import { ParserType } from "../../parser/types";
import { Validator } from "../../validator";
import { ExDefNode } from "../ast/def";
import { ExNode } from "../ast/node";
import { ExSymbolNode } from "../ast/primitives";
import { AExTraverser } from "./atraverser";

export class ExDefTraverser extends AExTraverser {
  constructor(
    protected readonly isPrivate: boolean,
    validator: Validator,
    traverser?: ExTraverser
  ) {
    super(validator, traverser);
  }

  get fnName(): string {
    return this.isPrivate ? "def-" : "def";
  }

  traverse(node: ParserList): ExDefNode {
    const args = this.args(node);
    const [name, value] = this.traverseArgs(args) as [ExSymbolNode, ExNode];

    return new ExDefNode(node.loc, name, value, this.isPrivate);
  }

  validate(node: ParserList): boolean {
    const args = this.args(node);

    return this.manyValidations(
      () => this.validateEqualLength(node, 2),
      () => this.invalidTypeProvided(args[0], ParserType.SYMBOL)
    );
  }
}
