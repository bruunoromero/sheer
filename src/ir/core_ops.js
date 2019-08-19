const utils = require("../utils")
const t = require("../parser/types")

const context = require("./context")
const validator = require("./validator")
const transformer = require("./transformer")

const traverseArgs = (args, ctx, traverse) =>
  args.map(el => traverse(el, ctx)).filter(e => e)

const coreFunction = (validateFn, fn) => validator => (
  meta,
  args,
  ctx,
  traverse
) => {
  validateFn(validator, meta, args)

  return fn(meta, args, ctx, traverse, validator)
}

const fn = coreFunction(validator.fn, (meta, args, ctx, traverse) => {
  const fCtx = context(ctx)
  const [args_, ...body] = traverseArgs(args, fCtx, traverse)

  return transformer.fn(args_, body)
})

const def = coreFunction(validator.def, (meta, args, ctx, traverse) => {
  const [sym, value] = traverseArgs(args, ctx, traverse)
  const transformed = transformer.def(sym, value)

  ctx.addDefinition(sym.value, true, transformed)

  return transformed
})

const defp = coreFunction(validator.defp, (meta, args, ctx, traverse) => {
  const [sym, value] = traverseArgs(args, ctx, traverse)
  const transformed = transformer.def(sym, value)
  ctx.addDefinition(sym.value, false, transformed)

  return transformed
})

const defn = coreFunction(
  validator.def,
  (meta, args, ctx, traverse, validator) => {
    const [sym, ...rest] = args
    const tSym = traverse(sym, ctx)

    const value = fn(validator)(meta, rest, ctx)
    const transformed = transformer.def(tSym, value)

    ctx.addDefinition(sym.value, true, transformed)

    return transformed
  }
)

const defnp = coreFunction(
  validator.def,
  (meta, args, ctx, traverse, validator) => {
    const [sym, ...rest] = traverseArgs(args, ctx, traverse)
    const value = fn(validator)(meta, rest, ctx)
    const transformed = transformer.def(sym, value)

    ctx.addDefinition(sym.value, false, transformed)

    return transformed
  }
)

const ns = coreFunction(validator.ns, (meta, args, ctx, traverse) => {
  const [sym] = traverseArgs(args, ctx, traverse)

  ctx.name(sym.value)
})

const if_ = coreFunction(validator.if_, (meta, args, ctx, traverse) => {
  const [cond, truthy, falsy] = traverseArgs(args, ctx, traverse)

  return transformer.if_(cond, truthy, falsy)
})

const when = coreFunction(validator.when, (meta, args, ctx, traverse) => {
  const [cond, truthy, falsy] = traverseArgs(args, ctx, traverse)

  return transformer.when(cond, truthy, falsy)
})

const and = coreFunction(validator.ok, (meta, args, ctx, traverse) => {
  const _args = traverseArgs(args, ctx, traverse)
  if (_args.length === 0) {
    return transformer.true_
  }

  if (_args.length === 1) {
    return _args[0]
  }

  return transformer.and(_args)
})

const or = coreFunction(validator.ok, (meta, args, ctx, traverse) => {
  const _args = traverseArgs(args, ctx, traverse)
  if (_args.length === 0) {
    return transformer.true_
  }

  if (_args.length === 1) {
    return _args[0]
  }

  return transformer.or(_args)
})

const eq = coreFunction(validator.ok, (meta, args, ctx, traverse) => {
  const _args = traverseArgs(args, ctx, traverse)

  if (_args.length === 0) {
    return transformer.true_
  }

  if (_args.length === 1) {
    return _args[0]
  }

  return transformer.eq(_args)
})

const notEq = coreFunction(validator.ok, (meta, args, ctx, traverse) => {
  const _args = traverseArgs(args, ctx, traverse)

  if (_args.length === 0) {
    return transformer.false_
  }

  if (_args.length === 1) {
    return _args[0]
  }

  return transformer.notEq(_args)
})

const not = coreFunction(validator.not, (meta, args, ctx, traverse) => {
  const _args = traverseArgs(args, ctx, traverse)

  if (_args.length === 0) {
    return transformer.false_
  }

  return transformer.not(_args[0])
})

module.exports = validator => {
  return {
    ns: ns(validator),
    fn: fn(validator),
    or: or(validator),
    eq: eq(validator),
    if_: if_(validator),
    def: def(validator),
    and: and(validator),
    not: not(validator),
    defn: defn(validator),
    defp: defp(validator),
    when: when(validator),
    notEq: notEq(validator),
    defnp: defnp(validator)
  }
}
