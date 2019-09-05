import { Validator } from "../validator";
import { ParserConcreteNode } from "../parser/ast";
import { Traverser } from "./traverser";
import { ExNode } from "./ast/node";
import { ExType } from "./types";
import { ExNamespaceNode } from "./ast/namespace";

export class File {
  constructor(
    public readonly path: string,
    public readonly source: string,
    public readonly program: ExNode[]
  ) {}
}

export default (path: string, source: string, ast: ParserConcreteNode[]) => {
  const validator = new Validator(path, source);
  const traverser = new Traverser(validator);

  let irAst = ast.map(node => traverser.traverseAndValidate(node));

  if (irAst[0].type === ExType.NS) {
    const ns = irAst[0] as ExNamespaceNode;

    irAst = [ns as ExNode]
      .concat(ns.buildImports())
      .concat(ns.buildRequires())
      .concat(irAst.slice(1));
  }

  console.log(irAst);

  return new File(path, source, irAst);
};
