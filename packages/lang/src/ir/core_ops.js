const utils = require("../utils");
const t = require("../parser/types");

const context = require("./context");
const validator = require("./validator");
const transformer = require("./transformer");

const traverseArgs = (args, ctx, traverse) =>
  args.map(el => traverse(el, ctx)).filter(e => e);

const coreFunction = (validateFn, fn) => validator => (
  meta,
  args,
  ctx,
  traverse
) => {
  validateFn(validator, meta, args, ctx);

  return fn(meta, args, ctx, traverse, validator);
};

const fnCall = coreFunction(validator.ok, (meta, args, ctx, traverse) => {
  const callee = traverse(meta.value[0], ctx);

  return transformer.fnCall(callee, traverseArgs(args, ctx, traverse));
});

const fn = coreFunction(validator.fn, (meta, args, ctx, traverse) => {
  const fCtx = context(ctx);
  const params = traverse(args[0], fCtx);

  params.value.forEach(el => fCtx.addDefinition(el.value, false, el));

  const body = traverseArgs(args.slice(1), fCtx, traverse);

  return transformer.fn(params.value, body);
});

const def = coreFunction(validator.def, (meta, args, ctx, traverse) => {
  const [sym, value] = traverseArgs(args, ctx, traverse);
  const transformed = transformer.def(sym, value);

  ctx.addDefinition(sym.value, true, transformed, true);

  return transformed;
});

const defp = coreFunction(validator.def, (meta, args, ctx, traverse) => {
  const [sym, value] = traverseArgs(args, ctx, traverse);
  const transformed = transformer.def(sym, value);
  ctx.addDefinition(sym.value, false, transformed, true);

  return transformed;
});

const defn = coreFunction(
  validator.defn,
  (meta, args, ctx, traverse, validator) => {
    const [sym, ...rest] = args;
    const tSym = traverse(sym, ctx);

    //PLACING A PLACEHOLDER ON THE CONTEXT, SO IT REFERENCES CORRECTLY
    ctx.addDefinition(sym.value, true, true);

    const value = fn(validator)(meta, rest, ctx, traverse);
    const transformed = transformer.def(sym, value);

    //RE-PLACING THE PLACEHOLDER ON THE CONTEXT WITH THE CORRECT VALUE
    ctx.addDefinition(sym.value, true, transformed);

    return transformed;
  }
);

const defnp = coreFunction(
  validator.defn,
  (meta, args, ctx, traverse, validator) => {
    const [sym, ...rest] = traverseArgs(args, ctx, traverse);
    const value = fn(validator)(meta, rest, ctx);
    const transformed = transformer.def(sym, value);

    ctx.addDefinition(sym.value, false, transformed);

    return transformed;
  }
);

const ns = coreFunction(validator.ns, (meta, args, ctx, traverse) => {
  const [sym, ...rest] = traverseArgs(args, ctx, traverse);
  const extra = utils.chunks(rest, 2);

  console.log(extra);

  ctx.name(sym.value);
});

const if_ = coreFunction(validator.if_, (meta, args, ctx, traverse) => {
  const [cond, truthy, falsy] = traverseArgs(args, ctx, traverse);

  return transformer.if_(cond, truthy, falsy);
});

const when = coreFunction(validator.when, (meta, args, ctx, traverse) => {
  const [cond, truthy, falsy] = traverseArgs(args, ctx, traverse);

  return transformer.when(cond, truthy, falsy);
});

const and = coreFunction(validator.ok, (meta, args, ctx, traverse) => {
  const _args = traverseArgs(args, ctx, traverse);
  if (_args.length === 0) {
    return transformer.true_;
  }

  if (_args.length === 1) {
    return _args[0];
  }

  return transformer.and(_args);
});

const or = coreFunction(validator.ok, (meta, args, ctx, traverse) => {
  const _args = traverseArgs(args, ctx, traverse);
  if (_args.length === 0) {
    return transformer.true_;
  }

  if (_args.length === 1) {
    return _args[0];
  }

  return transformer.or(_args);
});

const eq = coreFunction(validator.ok, (meta, args, ctx, traverse) => {
  const _args = traverseArgs(args, ctx, traverse);

  if (_args.length === 0) {
    return transformer.true_;
  }

  if (_args.length === 1) {
    return _args[0];
  }

  return transformer.eq(_args);
});

const notEq = coreFunction(validator.ok, (meta, args, ctx, traverse) => {
  const _args = traverseArgs(args, ctx, traverse);

  if (_args.length === 0) {
    return transformer.false_;
  }

  if (_args.length === 1) {
    return _args[0];
  }

  return transformer.notEq(_args);
});

const not = coreFunction(validator.not, (meta, args, ctx, traverse) => {
  const _args = traverseArgs(args, ctx, traverse);

  return transformer.not(_args[0]);
});

const require_ = coreFunction(
  validator.require_,
  (meta, args, ctx, traverse, vldt) => {
    const [ns, ...rest] = traverse(args[0], ctx).value;
    const grouppedRest = utils.chunks(rest, 2);

    const maybeAs = grouppedRest.filter(group => group[0].value === "as")[0];
    const maybeRefer = grouppedRest.filter(
      group => group[0].value === "refer"
    )[0];

    const as = maybeAs ? maybeAs[1] : null;
    const refer = maybeRefer ? maybeRefer[1] : null;

    const transformed = transformer.require_(ns, as, refer);

    ctx.addRequirement(transformed);

    return transformed;
  }
);

const nativeFnCall = coreFunction(
  validator.ok,
  (meta, args, ctx, traverse, vldt) => {
    const fnCall = meta.value[0];
    const callee = traverse(args[0], ctx);
    const member = transformer.member([callee.value, fnCall.value.slice(1)]);

    return transformer.fnCall(
      member,
      traverseArgs(args.slice(1), ctx, traverse)
    );
  }
);

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
    defnp: defnp(validator),
    fnCall: fnCall(validator),
    require_: require_(validator),
    nativeFnCall: nativeFnCall(validator)
  };
};
