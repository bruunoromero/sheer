const t = require("./types");
const transformer = require("./transformer");

const resolve = (node, ctx) => {
  switch (node.type) {
    case t.OR:
    case t.EQ:
    case t.AND:
    case t.NOT_EQ:
      return resolveBinary(node, ctx);
    case t.IF:
      return resolveIF(node, ctx);
    case t.VECTOR:
      return resolveVector(node, ctx);
    case t.NOT:
      return resolveNot(node, ctx);
    case t.SYMBOL:
      return resolveSymbol(node, ctx);
  }

  return node;
};

const resolveIF = (node, ctx) => {
  node.cond = resolve(node.cond, ctx);
  node.truthy = resolve(node.truthy, ctx);
  node.falsy = resolve(node.falsy, ctx);

  return node;
};

const resolveBinary = (node, ctx) => {
  node.left = resolve(node.left, ctx);
  node.right = resolve(node.right, ctx);

  return node;
};

const resolveNot = (node, ctx) => {
  node.value = resolve(node, ctx);
  return node;
};

const resolveVector = (node, ctx) => {
  node.value = node.value.map(el => resolve(el, ctx));
  return node;
};

const resolveSymbol = (node, ctx) => {
  if (node.type === t.SYMBOL) {
    const resolved = ctx.resolve(node.value);

    if (Array.isArray(resolved)) {
      return transformer.member(resolved);
    } else {
      return transformer.symbol({ value: resolved });
    }
  }

  return node;
};

module.exports = resolve;
module.exports.resolveIf = resolveIF;
module.exports.resolveNot = resolveNot;
module.exports.resolveBinary = resolveBinary;
module.exports.resolveVector = resolveVector;
module.exports.resolveSymbol = resolveSymbol;
