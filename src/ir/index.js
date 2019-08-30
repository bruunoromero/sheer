const R = require("ramda");

const context = require("./context");
const coreOps = require("./core_ops");
const resolve = require("./resolver");
const validator = require("./validator");
const transformer = require("./transformer");

const pt = require("../parser/types");

const resolveSymbols = fn => (node, ctx, core) => {
  const traversed = fn(node, ctx, core);

  if (traversed) {
    return resolve(traversed, ctx);
  }
};

const traverseWithCore = (traverse, core) => {
  const curriedTraverse = R.curry(traverse);

  return curriedTraverse(R.__, R.__, core);
};

const traverse = resolveSymbols((node, ctx, core) => {
  switch (node.type) {
    case pt.NULL:
    case pt.BOOL:
    case pt.STRING:
    case pt.NUMBER:
    case pt.KEYWORD:
      return transformer.primitive(node);
    case pt.SYMBOL:
      return transformer.symbol(node);
    case pt.LIST:
      return traverseList(node, ctx, core);
    case pt.VECTOR:
      return traverseVector(node, ctx, core);
  }

  throw new Error(`could not traverse type ${node.type}`);
});

const traverseAst = (ast, vldt, core) => {
  const ctx = context();
  const res = ast.map(node => traverse(node, ctx, core)).filter(e => e);

  const errors = vldt.errors();

  if (errors) {
    throw errors;
  }

  return generateDefinitions(ctx).concat(res);
};

const generateDefinitions = ctx => {
  return ctx
    .definitions()
    .map(el => transformer.declare(el, transformer.null_, true));
};

const traverseVector = ({ value }, ctx, core) => {
  const mValue = value.map(el => traverse(el, ctx, core));

  return transformer.vector(mValue);
};

const traverseList = (node, ctx, core) => {
  const firstEl = node.value[0];
  const rest = node.value.slice(1);

  const _traverse = traverseWithCore(traverse, core);

  switch (firstEl.value) {
    case "ns":
      return core.ns(node, rest, ctx, _traverse);
    case "fn":
      return core.fn(node, rest, ctx, _traverse);
    case "def":
      return core.def(node, rest, ctx, _traverse);
    case "def-":
      return core.defp(node, rest, ctx, _traverse);
    case "defn":
      return core.defn(node, rest, ctx, _traverse);
    case "defn-":
      return core.defnp(node, rest, ctx, _traverse);
    case "if":
      return core.if_(node, rest, ctx, _traverse);
    case "when":
      return core.when(node, rest, ctx, _traverse);
    case "and":
      return core.and(node, rest, ctx, _traverse);
    case "or":
      return core.or(node, rest, ctx, _traverse);
    case "=":
      return core.eq(node, rest, ctx, _traverse);
    case "not":
      return core.not(node, rest, ctx, _traverse);
    case "not=":
      return core.notEq(node, rest, ctx, _traverse);
    default:
      return core.fnCall(node, rest, ctx, _traverse);
  }

  throw new Error(`could not traverse type ${node.type}`);
};

module.exports = (filename, source, ast) => {
  const vldt = validator(filename, source);
  const core = coreOps(vldt);

  return traverseAst(ast, vldt, core);
};

module.exports.traverse = traverse;
module.exports.traverseAst = traverseAst;
module.exports.traverseList = traverseList;
module.exports.traverseVector = traverseVector;
module.exports.generateDefinitions = generateDefinitions;
