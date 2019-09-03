import { IrType } from "./types";
import * as utils from "../utils";

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
  type: IrType.BOOL,
  value: true
};

const false_ = {
  type: IrType.BOOL,
  value: false
};

const null_ = {
  type: IrType.NULL,
  value: null
};

module.exports.primitive = ({ value, type }) => {
  return {
    type,
    value
  };
};

module.exports.string = value => {
  return {
    value,
    type: IrType.STRING
  };
};

module.exports.vector = value => {
  return {
    value,
    type: IrType.VECTOR
  };
};

module.exports.fn = (params, body, rest) => {
  return {
    rest,
    body,
    params,
    type: IrType.FN
  };
};

module.exports.symbol = ({ value }) => {
  return { type: IrType.SYMBOL, value };
};

module.exports.if_ = (cond, truthy, falsy) => {
  return { type: IrType.IF, cond, truthy, falsy };
};

module.exports.when = (cond, truthy) => {
  return { type: IrType.IF, cond, truthy, falsy: null_ };
};

module.exports.def = (sym, expr) => {
  const name = sym.value || sym.member.value;

  return {
    name,
    value: expr,
    type: IrType.DEF
  };
};

const logOp = (args, op) => {
  if (args.length > 2) {
    return {
      op,
      type: IrType.LOG_OP,
      left: args[0],
      right: logOp(args.slice(1), op)
    };
  }

  return {
    op,
    type: IrType.LOG_OP,
    left: args[0],
    right: args[1]
  };
};

const binOp = (args, op, notJoining?: boolean) => {
  if (args.length > 2) {
    if (notJoining) {
      return {
        op,
        type: IrType.LOG_OP,
        left: args[0],
        right: binOp(args.slice(1), op, notJoining)
      };
    }

    return manyOp(args, op);
  }

  return {
    op,
    type: IrType.BIN_OP,
    left: args[0],
    right: args[1]
  };
};

module.exports.declare = (value, init, isGlobal) => {
  return {
    init,
    value,
    isGlobal,
    type: IrType.DECLARE
  };
};

module.exports.member = ([owner, member], unnomralized) => {
  return {
    owner,
    member,
    unnomralized,
    type: IrType.MEMBER
  };
};

module.exports.fnCall = (callee, args) => {
  return {
    args,
    callee,
    type: IrType.FN_CALL
  };
};

module.exports.list = () => {
  return {
    value: [],
    type: IrType.VECTOR
  };
};

module.exports.require_ = (ns, as, refer, fromNs) => {
  return {
    ns,
    as,
    refer,
    fromNs,
    type: IrType.REQUIRE
  };
};

module.exports.import_ = (path, as, fromNs) => {
  return {
    as,
    path,
    fromNs,
    type: IrType.IMPORT
  };
};

module.exports.logOp = logOp;
module.exports.binOp = binOp;
module.exports.null_ = null_;
module.exports.true_ = true_;
module.exports.false_ = false_;
