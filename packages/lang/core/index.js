// Utils
require("source-map-support").install();

const root =
  (typeof self === "object" && self.self === self && self) ||
  (typeof global === "object" && global.global === global && global) ||
  this;

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

module.exports.pick = (keys, obj) => {
  return Object.keys(obj)
    .filter(key => keys.indexOf(key) >= 0)
    .reduce((newObj, key) => Object.assign(newObj, { [key]: obj[key] }), {});
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

module.exports.not = v => {
  return !v;
};

// Interop

module.exports.fromGlobal = name => {
  return root[name];
};

module.exports.instaciate = curry((Cls, args) => {
  return new (Cls.bind.apply(Cls, args))();
});

module.exports.isInstance = curry((Cls, v) => {
  return v instanceof Cls;
});

module.exports.r = pattern => {
  return new RegExp(pattern);
};

module.exports.tryCatch = curry((toTry, toCatch) => {
  try {
    return toTry();
  } catch (e) {
    return toCatch(e);
  }
});

module.exports.throw = e => {
  throw e;
};

module.exports.discard = curry(fn => {
  return (...args) => {
    fn(...args);
  };
});

module.exports.type = v => {
  return typeof v;
};

module.exports.apply = curry((fn, args) => {
  return fn(...args);
});

module.exports.get = curry((coll, k) => {
  return coll[k];
});

module.exports.curry = curry;
