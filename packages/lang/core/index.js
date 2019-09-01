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

module.exports.curry = curry;
