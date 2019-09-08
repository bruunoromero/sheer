import { ParserList, ParserConcreteNode, Location } from "../../parser/ast";
import { ExFnNode } from "../ast/fn";
import { AExTraverser } from "./atraverser";
import { ExSymbolNode, ExVectorNode } from "../ast/primitives";
import { ParserType } from "../../parser/types";

export class ExFnTraverser extends AExTraverser {
  get fnName(): string {
    return "fn";
  }

  traverse(node: ParserList): ExFnNode {
    const args = this.args(node);
    return this.transformWithLoc(node.loc, args);
  }

  transformWithLoc(loc: Location, nodes: ParserConcreteNode[]) {
    const paramsVector = this.traverser.traverseAndValidate(
      nodes[0]
    ) as ExVectorNode;

    const isRest = paramsVector.value.some(
      (el: ExSymbolNode) => el.value === "&"
    );

    const params = paramsVector.value.filter(
      (el: ExSymbolNode) => el.value !== "&"
    ) as ExSymbolNode[];

    const body = this.traverseArgs(nodes.slice(1));

    return new ExFnNode(loc, body, params, isRest);
  }

  validate(node: ParserList): boolean {
    const args = this.args(node);

    return this.manyValidations(
      () => this.validateEqualLength(node, 2),
      () => this.invalidTypeProvided(args[0], ParserType.VECTOR)
    );
  }
}
