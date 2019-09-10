import { Validator } from "../validator";
import { ParserConcreteNode } from "../parser/ast";
import { ExTraverser } from "./traverser";
import { ExNode } from "./ast/node";
import { ExType } from "./types";
import { ExNamespaceNode } from "./ast/namespace";
import * as utils from "../utils";
import * as project from "../project";
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
  ast: ParserConcreteNode[],
  config: project.SheerConfig
): ExFile => {
  const validator = new Validator(source, path);
  const traverser = new ExTraverser(validator);

  let irAst = ast.map(node => traverser.traverseAndValidate(node));

  if (irAst[0].type === ExType.NS) {
    const ns = irAst[0] as ExNamespaceNode;

    if (utils.nameToPath(ns.name.value, config) !== path) {
      validator.addError(
        ns.name.loc,
        `namespace does not conform to file path`
      );
    }

    const errors = validator.errors;

    if (errors) {
      throw errors;
    }

    irAst = [ns as ExNode]
      .concat(ns.buildImports())
      .concat(ns.buildRequires())
      .concat(irAst.slice(1));
  }

  return new ExFile(path, source, irAst);
};
