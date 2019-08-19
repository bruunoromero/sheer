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

    return generateDefinitions(ctx)
      .concat(res)
      .concat(generateExports(ctx))
  }

  const generateDefinitions = ctx => {
    return ctx.definitions().map(transformer.declare)
  }

  const generateExports = ctx => {
    return ctx.exports().map(transformer.export)
  }

  const traverse = (node, ctx) => {
    switch (node.type) {
      case pt.NULL:
      case pt.BOOL:
      case pt.STRING:
      case pt.NUMBER:
      case pt.KEYWORD:
        return transformer.primitive(node)
      case pt.SYMBOL:
        return transformer.symbol(node)
      case pt.LIST:
        return traverseList(node, ctx)
      case pt.VECTOR:
        return traverseVector(node, ctx)
    }

    throw new Error(`could not traverse type ${node.type}`)
  }

  const traverseVector = ({ value }, ctx) => {
    const mValue = value.map(el => traverse(el, ctx))

    return transformer.vector(mValue)
  }

  const traverseList = (node, ctx) => {
    const firstEl = node.value[0]
    const rest = node.value.slice(1)

    switch (firstEl.value) {
      case "ns":
        return core.ns(node, rest, ctx, traverse)
      case "fn":
        return core.fn(node, rest, ctx, traverse)
      case "def":
        return core.def(node, rest, ctx, traverse)
      case "def-":
        return core.defp(node, rest, ctx, traverse)
      case "defn":
        return core.defn(node, rest, ctx, traverse)
      case "defn-":
        return core.defnp(node, rest, ctx, traverse)
      case "if":
        return core.if_(node, rest, ctx, traverse)
      case "when":
        return core.when(node, rest, ctx, traverse)
      case "and":
        return core.and(node, rest, ctx, traverse)
      case "or":
        return core.or(node, rest, ctx, traverse)
      case "=":
        return core.eq(node, rest, ctx, traverse)
      case "not":
        return core.not(node, rest, ctx, traverse)
      case "not=":
        return core.notEq(node, rest, ctx, traverse)
    }

    throw new Error(`could not traverse type ${node.type}`)
  }

  return traverseAll()
}
