const babel = require("@babel/types")

const t = require("../ir/types")
const transformer = require("./transformer")

module.exports = ir => {
  const globals = babel.variableDeclaration("const", [
    babel.variableDeclarator(
      babel.identifier("globals"),
      babel.objectExpression([])
    )
  ])

  const body = [globals].concat(ir.map(traverse).map(transformer.statement))

  return babel.program(body, [], "module")
}

const traverse = node => {
  switch (node.type) {
    case t.DECLARE:
      return transformer.declare(node, traverse)
    case t.DEF:
      return transformer.def(node, traverse)
    case t.NUMBER:
      return transformer.number(node, traverse)
    case t.IF:
      return transformer.if_(node, traverse)
    case t.SYMBOL:
      return transformer.symbol(node, traverse)
    case t.NULL:
      return transformer.null_(node, traverse)
    case t.AND:
      return transformer.and(node, traverse)
    case t.EQ:
      return transformer.eq(node, traverse)
    case t.NOT_EQ:
      return transformer.notEq(node, traverse)
    case t.NOT:
      return transformer.not(node, traverse)
    case t.FN:
      return transformer.fn(node, traverse)
    case t.EXPORT:
      return transformer.export(node, traverse)
  }

  throw `could not traverse type ${node.type} at compiler`
}
