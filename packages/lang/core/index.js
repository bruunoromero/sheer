// Utils

const curry = f => {
  function currify() {
    const args = Array.prototype.slice.call(arguments);
    return args.length >= f.length
      ? f.apply(null, args)
      : currify.bind(null, ...args);
  }
  Object.defineProperty(currify, "name", { value: f.name });

  return currify;
};

// Arithmetic Operations

module.exports.add = curry((...els) => {
  return els.reduce((a, b) => a + b);
});

module.exports.sub = curry((...els) => {
  return els.reduce((a, b) => a - b);
});

module.exports.mul = curry((...els) => {
  return els.reduce((a, b) => a * b);
});

module.exports.div = curry((...els) => {
  return els.reduce((a, b) => a / b);
});

module.exports.eq = curry((l, r) => {
  return l === r;
});

module.exports.notEq = curry((l, r) => {
  return l !== r;
});

module.exports.not = curry(v => {
  return !v;
});

// Interop

module.exports.instaciate = curry((Cls, args) => {
  return new (Cls.bind.apply(Cls, args))();
});

module.exports.isInstance = curry((Cls, v) => {
  return v instanceof Cls;
});

module.exports.r = curry(pattern => {
  return new RegExp(pattern);
});

module.exports.tryCatch = curry((toTry, toCatch) => {
  try {
    return toTry();
  } catch (e) {
    return toCatch(e);
  }
});

module.exports.discard = curry(fn => {
  return (...args) => {
    fn(...args);
  };
});

module.exports.raise = curry(err => {
  throw err;
});

module.exports.type = curry(v => {
  return typeof v;
});

module.exports.curry = curry;
