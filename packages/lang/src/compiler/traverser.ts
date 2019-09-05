const babel = require("@babel/types");

import * as utils from "../utils";
import { ExType } from "../expander/types";
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
    case ExType.STRING:
    case ExType.KEYWORD:
      return transformer.string(node, traverse);
    case ExType.DECLARE:
      return transformer.declare(node, traverse);
    case ExType.DEF:
      return transformer.def(node, traverse);
    case ExType.NUMBER:
      return transformer.number(node, traverse);
    case ExType.BOOL:
      return transformer.bool(node, traverse);
    case ExType.IF:
      return transformer.if_(node, traverse);
    case ExType.SYMBOL:
      return transformer.symbol(node, traverse);
    case ExType.NULL:
      return transformer.null_(node, traverse);
    case ExType.BIN_OP:
      return transformer.binOp(node, traverse);
    case ExType.LOG_OP:
      return transformer.logOp(node, traverse);
    case ExType.FN:
      return transformer.fn(node, traverse);
    case ExType.MEMBER:
      return transformer.member(node, traverse);
    case ExType.VECTOR:
      return transformer.vector(node, traverse);
    case ExType.FN_CALL:
      return transformer.fnCall(node, traverse);
    case ExType.REQUIRE:
      return transformer.require_(node, traverse, config);
    case ExType.IMPORT:
      return transformer.import_(node, traverse, config);
  }

  // throw `could not traverse type ${node.type} at compiler`;
};
