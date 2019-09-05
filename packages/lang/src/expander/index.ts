import { Validator } from "../validator";
import { ParserConcreteNode } from "../parser/ast";
import { Traverser } from "./traverser";
import { ExNode } from "./ast/node";

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

  const irAst = ast.map(node => traverser.traverseAndValidate(node));

  return new File(path, source, irAst);
};
