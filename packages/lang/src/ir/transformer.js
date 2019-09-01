const t = require("./types");
const utils = require("../utils");

const manyOp = (args, op) => {
  const els = args.slice(0, -1);
  const sEls = args.slice(1);

  const eqs = els.map((el, i) => {
    const sEl = sEls[i];
    return binOp([el, sEl], op);
  });

  return logOp(eqs, "&&");
};

const true_ = {
  type: t.BOOL,
  value: true
};

const false_ = {
  type: t.BOOL,
  value: false
};

const null_ = {
  type: t.NULL,
  value: null
};

module.exports.primitive = ({ value, type }) => {
  return {
    type,
    value
  };
};

module.exports.vector = value => {
  return {
    value,
    type: t.VECTOR
  };
};

module.exports.fn = (params, body) => {
  return {
    body,
    params,
    type: t.FN
  };
};

module.exports.symbol = ({ value }) => {
  return { type: t.SYMBOL, value };
};

module.exports.if_ = (cond, truthy, falsy) => {
  return { type: t.IF, cond, truthy, falsy };
};

module.exports.when = (cond, truthy) => {
  return { type: t.IF, cond, truthy, falsy: null_ };
};

module.exports.def = (sym, expr) => {
  return {
    type: t.DEF,
    name: sym.value,
    value: expr
  };
};

const logOp = (args, op) => {
  if (args.length > 2) {
    return {
      op,
      type: t.LOG_OP,
      left: args[0],
      right: logOp(args.slice(1), op)
    };
  }

  return {
    op,
    type: t.LOG_OP,
    left: args[0],
    right: args[1]
  };
};

const binOp = (args, op, notJoining) => {
  if (args.length > 2) {
    if (notJoining) {
      return {
        op,
        type: t.LOG_OP,
        left: args[0],
        right: binOp(args.slice(1), op, notJoining)
      };
    }

    return manyOp(args, op);
  }

  return {
    op,
    type: t.BIN_OP,
    left: args[0],
    right: args[1]
  };
};

module.exports.not = value => {
  return {
    value,
    type: t.NOT
  };
};

module.exports.declare = (value, init, isGlobal) => {
  return {
    init,
    value,
    isGlobal,
    type: t.DECLARE
  };
};

module.exports.member = ([owner, member]) => {
  return {
    owner,
    member,
    type: t.MEMBER
  };
};

module.exports.fnCall = (callee, args) => {
  return {
    args,
    callee,
    type: t.FN_CALL
  };
};

module.exports.list = () => {
  return {
    value: [],
    type: t.VECTOR
  };
};

module.exports.require_ = (ns, as, refer) => {
  return {
    ns,
    as,
    refer,
    type: t.REQUIRE
  };
};

module.exports.logOp = logOp;
module.exports.binOp = binOp;
module.exports.null_ = null_;
module.exports.true_ = true_;
module.exports.false_ = false_;
