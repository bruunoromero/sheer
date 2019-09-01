const babel = require("@babel/types");

const t = require("../ir/types");
const utils = require("../utils");
const transformer = require("./transformer");

module.exports = (ir, config) => {
  const langCore = babel.importDeclaration(
    [babel.importNamespaceSpecifier(babel.identifier(utils.CORE))],
    babel.stringLiteral("@cris/lang/core")
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
    .concat(ir.map(node => traverse(node, config)).map(transformer.statement))
    .concat([exportGlobals]);

  return babel.program(body, [], "module");
};

const traverse = (node, config) => {
  switch (node.type) {
    case t.STRING:
    case t.KEYWORD:
      return transformer.string(node, traverse);
    case t.DECLARE:
      return transformer.declare(node, traverse);
    case t.DEF:
      return transformer.def(node, traverse);
    case t.NUMBER:
      return transformer.number(node, traverse);
    case t.IF:
      return transformer.if_(node, traverse);
    case t.SYMBOL:
      return transformer.symbol(node, traverse);
    case t.NULL:
      return transformer.null_(node, traverse);
    case t.BIN_OP:
      return transformer.binOp(node, traverse);
    case t.LOG_OP:
      return transformer.logOp(node, traverse);
    case t.NOT:
      return transformer.not(node, traverse);
    case t.FN:
      return transformer.fn(node, traverse);
    case t.MEMBER:
      return transformer.member(node, traverse);
    case t.VECTOR:
      return transformer.vector(node, traverse);
    case t.FN_CALL:
      return transformer.fnCall(node, traverse);
    case t.REQUIRE:
      return transformer.require_(node, traverse, config);
    case t.IMPORT:
      return transformer.import_(node, traverse, config);
  }

  throw `could not traverse type ${node.type} at compiler`;
};
