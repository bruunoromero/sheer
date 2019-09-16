import * as babel from "@babel/types";

import * as utils from "../utils";

import { IrType } from "../ir/types";
import * as transformer from "./transformer";
import { Project } from "../project";
import { IrNode, IrExpressionNode } from "../ir/ast/node";
import { IrFile } from "../ir";

export const traverse = (file: IrFile, config, opts) => {
  const langCore = babel.importDeclaration(
    [babel.importNamespaceSpecifier(babel.identifier(utils.RUNTIME))],
    babel.stringLiteral(`@${utils.EXT}/lang/runtime`)
  );

  const globals = babel.variableDeclaration("const", [
    babel.variableDeclarator(
      babel.identifier(utils.GLOBALS),
      babel.objectExpression([])
    )
  ]);

  const exportGlobals = babel.exportDefaultDeclaration(
    babel.callExpression(
      babel.memberExpression(
        babel.identifier(utils.RUNTIME),
        babel.identifier("pick")
      ),
      [
        babel.arrayExpression(
          file.exports().map(name => babel.stringLiteral(name))
        ),
        babel.identifier(utils.GLOBALS)
      ]
    )
  );

  const body = ([langCore] as any[])
    .concat([globals])
    .concat(
      file.program
        .map(node => traverseNode(node, config, opts))
        .filter(e => e)
        .map(transformer.statement)
    )
    .concat([exportGlobals]);

  return babel.program(body, [], "module");
};

const traverseNode = (node: IrNode, project: Project, opts?: any) => {
  switch (node.type) {
    case IrType.STRING:
      return transformer.string(node);
    case IrType.DEF:
      return transformer.def(node, traverseNode);
    case IrType.NUMBER:
      return transformer.number(node);
    case IrType.BOOL:
      return transformer.bool(node);
    case IrType.IF:
      return transformer.if_(node, traverseNode);
    case IrType.SYMBOL:
      return transformer.symbol(node);
    case IrType.NULL:
      return transformer.null_();
    case IrType.LOG_OP:
      return transformer.logOp(node, traverseNode);
    case IrType.FN:
      return transformer.fn(node, traverseNode);
    case IrType.MEMBER:
      return transformer.member(node, traverseNode);
    case IrType.VECTOR:
      return transformer.vector(node, traverseNode);
    case IrType.MAP:
      return transformer.map(node, traverseNode);
    case IrType.FN_CALL:
      return transformer.fnCall(node, traverseNode);
    case IrType.REQUIRE:
      return transformer.require_(node, traverseNode, project, opts);
    case IrType.IMPORT:
      return transformer.import_(node, traverseNode, project);
    case IrType.EXPRESSION:
      return traverseNode((node as IrExpressionNode).value, project);
    case IrType.NATIVE_CALL:
      return transformer.nativeCall(node, traverseNode);
  }

  throw `could not traverse type ${node.type} at compiler`;
};
