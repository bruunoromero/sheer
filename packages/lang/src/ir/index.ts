import * as utils from "../utils";
import * as project from "../project";
import { ExFile } from "../expander";
import { IrContext } from "./contex";
import { ExType } from "../expander/types";
import { ExNamespaceNode } from "../expander/ast/namespace";
import { IrTraverser } from "./traverser";
import { Validator } from "../validator";
import { IrNode } from "./ast/node";
import { IrRequireNode } from "./ast/require";
import { IrSymbolNode, IrStringNode } from "./ast/primitives";

export class IrFile {
  constructor(
    public readonly ns: string | null,
    public readonly path: string,
    public readonly source: string,
    public readonly program: IrNode[],
    public readonly ctx: IrContext
  ) {}
}

export const transform = (file: ExFile) => {
  const ns: ExNamespaceNode | null =
    file.program[0].type === ExType.NS
      ? (file.program[0] as ExNamespaceNode)
      : null;

  const ctx = new IrContext(null, ns);
  const program = ns ? file.program.slice(1) : file.program;
  const validator = new Validator(file.source, file.path);

  const irProgram = program.map(node =>
    new IrTraverser(validator).traverseAndValidate(ctx, node)
  );

  const errors = validator.errors;

  if (errors) {
    throw errors;
  }

  const requireCore = new IrRequireNode(
    irProgram[0].loc,
    IrSymbolNode.fromIrNode(irProgram[0], "sheer.core"),
    null,
    IrStringNode.fromIrNode(irProgram[0], "all")
  );

  const programWithCore = [requireCore].concat(irProgram as any[]);

  const nsName = ns
    ? ns.name.value
    : utils.pathToName(file.path, project.config());

  ctx.addLocalRequirement("sheer.core", requireCore);
  return new IrFile(nsName, file.path, file.source, programWithCore, ctx);
};
