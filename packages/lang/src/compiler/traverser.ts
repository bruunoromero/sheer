const babel = require("@babel/types");

import * as utils from "../utils";
import { IrType } from "../ir/types";
const transformer = require("./transformer");

module.exports = (ir, config) => {
  const langCore = babel.importDeclaration(
    [babel.importNamespaceSpecifier(babel.identifier(utils.CORE))],
    babel.stringLiteral(`@${utils.EXT}/lang/core`)
  );

  const globals = babel.variableDeclaration("const", [
    babel.variableDeclarator(
      babel.identifier(utils.GLOBALS),
      babel.objectExpression([])
    )
  ]);

  const exportGlobals = babel.exportDefaultDeclaration(
    babel.identifier(utils.GLOBALS)
  );

  const body = [langCore]
    .concat([globals])
    .concat(
      ir
        .map(node => traverse(node, config))
        .filter(e => e)
        .map(transformer.statement)
    )
    .concat([exportGlobals]);

  return babel.program(body, [], "module");
};

const traverse = (node, config) => {
  switch (node.type) {
    case IrType.STRING:
    case IrType.KEYWORD:
      return transformer.string(node, traverse);
    case IrType.DECLARE:
      return transformer.declare(node, traverse);
    case IrType.DEF:
      return transformer.def(node, traverse);
    case IrType.NUMBER:
      return transformer.number(node, traverse);
    case IrType.BOOL:
      return transformer.bool(node, traverse);
    case IrType.IF:
      return transformer.if_(node, traverse);
    case IrType.SYMBOL:
      return transformer.symbol(node, traverse);
    case IrType.NULL:
      return transformer.null_(node, traverse);
    case IrType.BIN_OP:
      return transformer.binOp(node, traverse);
    case IrType.LOG_OP:
      return transformer.logOp(node, traverse);
    case IrType.FN:
      return transformer.fn(node, traverse);
    case IrType.MEMBER:
      return transformer.member(node, traverse);
    case IrType.VECTOR:
      return transformer.vector(node, traverse);
    case IrType.FN_CALL:
      return transformer.fnCall(node, traverse);
    case IrType.REQUIRE:
      return transformer.require_(node, traverse, config);
    case IrType.IMPORT:
      return transformer.import_(node, traverse, config);
  }

  throw `could not traverse type ${node.type} at compiler`;
};
