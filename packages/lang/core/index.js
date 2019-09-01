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

module.exports.curry = curry;
