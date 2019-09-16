const is = require("is_js")
const im = require("immutable")
const runtime = require("@sheer/lang/runtime")

const root =
  (typeof self === "object" && self.self === self && self) ||
  (typeof global === "object" && global.global === global && global) ||
  this

// Arithmetic Operations

module.exports.add = runtime.curry((a, b) => {
  if (is.not.number(a) || is.not.number(b)) {
    throw "Expected arguments to be numbers"
  }

  return a + b
})

module.exports.sub = runtime.curry((a, b) => {
  if (is.not.number(a) || is.not.number(b)) {
    throw "Expected arguments to be numbers"
  }

  return a - b
})

module.exports.mul = runtime.curry((a, b) => {
  if (is.not.number(a) || is.not.number(b)) {
    throw "Expected arguments to be numbers"
  }

  return a * b
})

module.exports.div = runtime.curry((a, b) => {
  if (is.not.number(a) || is.not.number(b)) {
    throw "Expected arguments to be numbers"
  }

  return a / b
})

const eq = runtime.curry((l, r) => {
  return im.is(l, r)
})

module.exports.eq = eq

const not = v => {
  return !v
}

module.exports.not = not

module.exports.notEq = runtime.curry((l, r) => {
  return not(eq(l, r))
})

// Interop

module.exports.fromGlobal = name => {
  return root[name]
}

module.exports.instaciate = runtime.curry((Cls, args) => {
  return new Cls(...args)
})

module.exports.isInstance = runtime.curry((Cls, v) => {
  return v instanceof Cls
})

module.exports.tryCatch = runtime.curry((toTry, toCatch) => {
  try {
    return toTry()
  } catch (e) {
    return toCatch(e)
  }
})

module.exports.throw = e => {
  throw e
}

module.exports.discard = runtime.curry(fn => {
  return (...args) => {
    fn(...args)
  }
})

module.exports.type = v => {
  return typeof v
}

module.exports.apply = runtime.curry((fn, args) => {
  return fn(...args)
})

module.exports.objects_get = runtime.curry((k, coll) => {
  return coll[k]
})
