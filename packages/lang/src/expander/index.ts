import { Validator } from "../validator";
import { ParserConcreteNode } from "../parser/ast";
import { ExTraverser } from "./traverser";
import { ExNode } from "./ast/node";
import { ExType } from "./types";
import { ExNamespaceNode } from "./ast/namespace";

export class ExFile {
  constructor(
    public readonly path: string,
    public readonly source: string,
    public readonly program: ExNode[]
  ) {}
}

export const transform = (
  path: string,
  source: string,
  ast: ParserConcreteNode[]
): ExFile => {
  const validator = new Validator(path, source);
  const traverser = new ExTraverser(validator);

  let irAst = ast.map(node => traverser.traverseAndValidate(node));

  if (irAst[0].type === ExType.NS) {
    const ns = irAst[0] as ExNamespaceNode;

    irAst = [ns as ExNode]
      .concat(ns.buildImports())
      .concat(ns.buildRequires())
      .concat(irAst.slice(1));
  }

  return new ExFile(path, source, irAst);
};
