const t = require("./types")
const utils = require("../utils")

const true_ = {
  type: t.BOOL,
  value: true
}

const false_ = {
  type: t.BOOL,
  value: false
}

const null_ = {
  type: t.NULL,
  value: null
}

module.exports.primitive = ({ value, type }) => {
  return {
    type,
    value
  }
}

module.exports.symbol = ({ value, type }) => {
  return { type, value: utils.normalizeName(value) }
}

module.exports.if_ = (cond, thuthy, falsy) => {
  return { type: t.IF, cond, thuthy, falsy }
}

module.exports.when = (cond, thuthy) => {
  return { type: t.IF, cond, thuthy, falsy: null_ }
}

module.exports.def = (sym, expr) => {
  return {
    type: t.DEF,
    name: sym.value,
    value: expr
  }
}

const and = args => {
  if (args.length > 2) {
    return {
      type: t.AND,
      left: args[0],
      right: and(args.slice(1))
    }
  }

  return {
    type: t.AND,
    left: args[0],
    right: args[1]
  }
}

const or = args => {
  if (args.length > 2) {
    return {
      type: t.OR,
      left: args[0],
      right: or(args.slice(1))
    }
  }

  return {
    type: t.OR,
    left: args[0],
    right: args[1]
  }
}

const eq = args => {
  if (args.length > 2) {
    return {
      type: t.EQ,
      left: args[0],
      right: or(args.slice(1))
    }
  }

  return {
    type: t.EQ,
    left: args[0],
    right: args[1]
  }
}

module.exports.eq = eq
module.exports.or = or
module.exports.and = and
module.exports.null_ = null_
module.exports.true_ = true_
module.exports.false_ = false_
