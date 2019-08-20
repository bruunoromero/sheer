const t = require("./types")
const utils = require("../utils")

const manyOp = (args, op) => {
  const els = args.slice(0, -1)
  const sEls = args.slice(1)

  const eqs = els.map((el, i) => {
    const sEl = sEls[i]
    return op([el, sEl])
  })

  return and(eqs)
}

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

module.exports.vector = value => {
  return {
    value,
    type: t.VECTOR
  }
}

module.exports.fn = (args, body) => {
  return {
    body,
    args,
    type: t.FN
  }
}

module.exports.symbol = ({ value, type }) => {
  return { type, value: utils.normalizeName(value) }
}

module.exports.if_ = (cond, truthy, falsy) => {
  return { type: t.IF, cond, truthy, falsy }
}

module.exports.when = (cond, truthy) => {
  return { type: t.IF, cond, truthy, falsy: null_ }
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
    return manyOp(args, eq)
  }

  return {
    type: t.EQ,
    left: args[0],
    right: args[1]
  }
}

const notEq = args => {
  if (args.length > 2) {
    return manyOp(args, notEq)
  }

  return {
    type: t.NOT_EQ,
    left: args[0],
    right: args[1]
  }
}

module.exports.not = value => {
  return {
    value,
    type: t.NOT
  }
}

module.exports.declare = value => {
  return {
    value,
    type: t.DECLARE
  }
}

module.exports.export = value => {
  return {
    value,
    type: t.EXPORT
  }
}

module.exports.member = ([owner, member]) => {
  return {
    owner,
    member,
    type: t.MEMBER
  }
}

module.exports.eq = eq
module.exports.or = or
module.exports.and = and
module.exports.notEq = notEq
module.exports.null_ = null_
module.exports.true_ = true_
module.exports.false_ = false_
