import { AExTraverser } from "./atraverser";
import { ParserList, ParserVector, ParserSymbol } from "../../parser/ast";
import { ExFnCallNode } from "../ast/fn_call";
import * as utils from "../../utils";
import { ExFnNode } from "../ast/fn";
import { ExSymbolNode } from "../ast/primitives";
import { ExNode } from "../ast/node";
import { ParserType } from "../../parser/types";

export class ExLetTraverser extends AExTraverser {
  traverse(node: ParserList): ExFnCallNode {
    const args = this.args(node);
    const body = args
      .slice(1)
      .map(node => this.traverser.traverseAndValidate(node));

    const bindings = utils
      .chunks((args[0] as ParserVector).value, 2)
      .map(([sym, value]) => [
        this.traverser.traverseAndValidate(sym),
        this.traverser.traverseAndValidate(value)
      ]) as [ExSymbolNode, ExNode][];

    return bindings.reduceRight((acc: any, [sym, value]) => {
      return new ExFnCallNode(
        node.loc,
        new ExFnNode(
          node.loc,
          Array.isArray(acc) ? acc : ([acc] as ExNode[]),
          [sym],
          false
        ),
        [value]
      );
    }, body);
  }

  validate(node: ParserList): boolean {
    const args = this.args(node);

    const bindings = utils.chunks((args[0] as ParserVector).value, 2);

    return this.manyValidations(
      () => this.validateMinLength(node, 2),
      () => this.invalidTypeProvided(args[0], ParserType.VECTOR),
      ...bindings.map(([sym]) => {
        return () => this.invalidTypeProvided(sym, ParserType.SYMBOL);
      })
    );
  }
}
