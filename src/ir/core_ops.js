const t = require("../parser/types")

const utils = require("../utils")
const validator = require("./validator")
const transformer = require("./transformer")

const coreFunction = (validateFn, fn) => validator => (meta, args, ctx) => {
  validateFn(validator, meta, args)

  return fn(meta, args, ctx)
}

const def = coreFunction(validator.def, (meta, args, ctx) => {
  const [sym, value] = args
  const transformed = transformer.def(sym, value)

  ctx.addDefinition(sym.value, true, transformed)

  return transformed
})

const defp = coreFunction(validator.defp, (meta, args, ctx) => {
  const [sym, value] = args
  const transformed = transformer.def(sym, value)
  ctx.addDefinition(sym.value, false, transformed)

  return transformed
})

const ns = coreFunction(validator.ns, (meta, args, ctx) => {
  const [sym] = args

  ctx.name(sym.value)
})

const if_ = coreFunction(validator.if_, (meta, args, ctx) => {
  const [cond, truthy, falsy] = args

  return transformer.if_(cond, truthy, falsy)
})

const when = coreFunction(validator.when, (meta, args, ctx) => {
  const [cond, truthy, falsy] = args

  return transformer.when(cond, truthy, falsy)
})

const and = coreFunction(validator.ok, (meta, args, ctx) => {
  if (args.length === 0) {
    return transformer.true_
  }

  if (args.length === 1) {
    return args[0]
  }

  return transformer.and(args)
})

const or = coreFunction(validator.ok, (meta, args, ctx) => {
  if (args.length === 0) {
    return transformer.true_
  }

  if (args.length === 1) {
    return args[0]
  }

  return transformer.or(args)
})

const eq = coreFunction(validator.ok, (meta, args, ctx) => {
  if (args.length === 0) {
    return transformer.true_
  }

  if (args.length === 1) {
    return args[0]
  }

  return transformer.eq(args)
})

module.exports = validator => {
  return {
    ns: ns(validator),
    or: or(validator),
    eq: eq(validator),
    if_: if_(validator),
    def: def(validator),
    and: and(validator),
    defp: defp(validator),
    when: when(validator)
  }
}
