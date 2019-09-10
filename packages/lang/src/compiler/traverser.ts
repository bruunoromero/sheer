const babel = require("@babel/types");

import * as utils from "../utils";

import { IrType } from "../ir/types";
import * as transformer from "./transformer";

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
      return transformer.string(node);
    case IrType.DEF:
      return transformer.def(node, traverse);
    case IrType.NUMBER:
      return transformer.number(node);
    case IrType.BOOL:
      return transformer.bool(node);
    case IrType.IF:
      return transformer.if_(node, traverse);
    case IrType.SYMBOL:
      return transformer.symbol(node);
    case IrType.NULL:
      return transformer.null_();
    case IrType.LOG_OP:
      return transformer.logOp(node, traverse);
    case IrType.FN:
      return transformer.fn(node, traverse);
    case IrType.MEMBER:
      return transformer.member(node, traverse);
    case IrType.VECTOR:
      return transformer.vector(node, traverse);
    case IrType.MAP:
      return transformer.map(node, traverse);
    case IrType.FN_CALL:
      return transformer.fnCall(node, traverse);
    case IrType.REQUIRE:
      return transformer.require_(node, traverse, config);
    case IrType.IMPORT:
      return transformer.import_(node, traverse, config);
    case IrType.EXPRESSION:
      return traverse(node.value, config);
    case IrType.NATIVE_CALL:
      return transformer.nativeCall(node, traverse);
  }

  throw `could not traverse type ${node.type} at compiler`;
};
