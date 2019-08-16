const context = require("./context")
const coreOps = require("./core_ops")
const validator = require("./validator")
const transformer = require("./transformer")

const pt = require("../parser/types")

module.exports = (filename, source, ast) => {
  const vldt = validator(filename, source)
  const core = coreOps(vldt)

  const traverseAll = () => {
    const ctx = context()
    const res = ast.map(node => traverse(node, ctx)).filter(e => e)

    const errors = vldt.errors()

    if (errors) {
      throw errors
    }
    console.log(ctx.name())
    return res
  }

  const traverse = (node, ctx) => {
    switch (node.type) {
      case pt.NULL:
      case pt.BOOL:
      case pt.STRING:
      case pt.NUMBER:
      case pt.KEYWORD:
        return transformer.primitive(node)

      case pt.LIST:
        return traverseList(node, ctx)
      case pt.SYMBOL:
        return transformer.symbol(node)
    }
  }

  const traverseList = (node, ctx) => {
    const firstEl = node.value[0]
    const rest = node.value
      .slice(1)
      .map(el => traverse(el, ctx))
      .filter(e => e)

    switch (firstEl.value) {
      case "ns":
        return core.ns(node, rest, ctx)
      case "def":
        return core.def(node, rest, ctx)
      case "def-":
        return core.defp(node, rest, ctx)
      case "if":
        return core.if_(node, rest, ctx)
      case "when":
        return core.when(node, rest, ctx)
      case "and":
        return core.and(node, rest, ctx)
      case "or":
        return core.or(node, rest, ctx)
      case "=":
        return core.eq(node, rest, ctx)
    }

    return node
  }

  return traverseAll()
}
