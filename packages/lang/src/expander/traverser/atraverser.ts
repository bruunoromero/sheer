import { Location, ParserConcreteNode, ParserList } from "../../parser/ast";
import { ParserType } from "../../parser/types";
import { Validator } from "../../validator";
import { ExNode, ExErrorNode } from "../ast/node";
import * as errors from "../errors";
import { ExTraverser } from "./index";

export abstract class AExTraverser {
  constructor(
    protected readonly validator: Validator,
    protected readonly traverser?: ExTraverser
  ) {}

  abstract traverse(node: ParserConcreteNode): ExNode;
  get fnName(): string {
    throw new Error("fnName not accessible");
  }

  validate(node: ParserConcreteNode): boolean {
    return true;
  }

  traverseAndValidate(node: ParserConcreteNode): ExNode {
    if (this.validate(node)) {
      return this.traverse(node);
    }

    return new ExErrorNode();
  }

  transformWithLoc(loc: Location, nodes: ParserConcreteNode[]): ExNode {
    throw new Error("method not implemented");
  }

  traverseArgs(args: ParserConcreteNode[]): ExNode[] {
    return args.map(el => this.traverser.traverseAndValidate(el));
  }

  args(node: ParserList): ParserConcreteNode[] {
    return node.value.slice(1);
  }

  manyValidations(...fns: (() => boolean)[]): boolean {
    return fns
      .map(fn => {
        try {
          return fn();
        } catch (e) {
          return false;
        }
      })
      .every(el => el === true);
  }

  invalidTypeProvided(arg: ParserConcreteNode, type: ParserType) {
    if (arg.type !== type) {
      this.validator.addError(
        arg.loc,
        errors.invalidTypeProvided(this.fnName, arg.type, type)
      );

      return false;
    }

    return true;
  }

  validateEqualLength(node: ParserList, expected: number) {
    const args = this.args(node);

    if (args.length !== expected) {
      this.validator.addError(
        node.loc,
        errors.invalidNumberOfArgs(this.fnName, args.length, expected)
      );

      return false;
    }

    return true;
  }

  validateMinLength(node: ParserList, expected: number) {
    const args = this.args(node);

    if (args.length < expected) {
      this.validator.addError(
        node.loc,
        errors.atLeastNumberOfArguments(this.fnName, args.length, expected)
      );

      return false;
    }

    return true;
  }
}
