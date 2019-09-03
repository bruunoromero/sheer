import { IrType } from "./types";

const transformer = require("./transformer");

export const resolve = (node, ctx) => {
  switch (node.type) {
    case IrType.BIN_OP:
    case IrType.LOG_OP:
      return resolveBinary(node, ctx);
    case IrType.IF:
      return resolveIF(node, ctx);
    case IrType.VECTOR:
      return resolveVector(node, ctx);
    case IrType.NOT:
      return resolveNot(node, ctx);
    case IrType.SYMBOL:
      return resolveSymbol(node, ctx);
  }

  return node;
};

export const resolveIF = (node, ctx) => {
  node.cond = resolve(node.cond, ctx);
  node.truthy = resolve(node.truthy, ctx);
  node.falsy = resolve(node.falsy, ctx);

  return node;
};

export const resolveBinary = (node, ctx) => {
  node.left = resolve(node.left, ctx);
  node.right = resolve(node.right, ctx);

  return node;
};

export const resolveNot = (node, ctx) => {
  node.value = resolve(node, ctx);
  return node;
};

export const resolveVector = (node, ctx) => {
  node.value = node.value.map(el => resolve(el, ctx));
  return node;
};

export const resolveSymbol = (node, ctx) => {
  if (node.type === IrType.SYMBOL) {
    const resolved = ctx.resolve(node.value);

    if (Array.isArray(resolved)) {
      return transformer.member(resolved);
    } else {
      return transformer.symbol({ value: resolved });
    }
  }

  return node;
};
