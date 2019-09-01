const R = require("ramda");

const resolve = require("./resolver");
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

  if (!firstEl) return transformer.list();

  const traverser = traverseWithCore(traverse, core);

  if (firstEl.value[0] === ".") {
    return core.nativeFnCall(node, rest, ctx, traverser);
  }

  switch (firstEl.value) {
    case "+":
      return core.add(node, rest, ctx, traverser);
    case "ns":
      return core.ns(node, rest, ctx, traverser);
    case "fn":
      return core.fn(node, rest, ctx, traverser);
    case "def":
      return core.def(node, rest, ctx, traverser);
    case "def-":
      return core.defp(node, rest, ctx, traverser);
    case "defn":
      return core.defn(node, rest, ctx, traverser);
    case "defn-":
      return core.defnp(node, rest, ctx, traverser);
    case "if":
      return core.if_(node, rest, ctx, traverser);
    case "when":
      return core.when(node, rest, ctx, traverser);
    case "and":
      return core.and(node, rest, ctx, traverser);
    case "or":
      return core.or(node, rest, ctx, traverser);
    case "=":
      return core.eq(node, rest, ctx, traverser);
    case "not":
      return core.not(node, rest, ctx, traverser);
    case "not=":
      return core.notEq(node, rest, ctx, traverser);
    case "require":
      return core.require_(node, rest, ctx, traverser);
    default:
      return core.fnCall(node, rest, ctx, traverser);
  }

  throw new Error(`could not traverse type ${node.type}`);
};

module.exports = (ast, vldt, core, ctx) => {
  const res = ast.map(node => traverse(node, ctx, core)).filter(e => e);

  const errors = vldt.errors();

  if (errors) {
    throw errors;
  }

  return generateDefinitions(ctx).concat(res);
};

module.exports.traverse = traverse;
module.exports.traverseList = traverseList;
module.exports.traverseVector = traverseVector;
module.exports.generateDefinitions = generateDefinitions;
