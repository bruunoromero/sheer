// Utils
require("source-map-support").install();

const im = require("immutable");

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

module.exports.fromJS = v => {
  if (im.isImmutable(v)) return v;

  return im.fromJS(v);
};

module.exports.pick = curry((keys, obj) => {
  return Object.keys(obj)
    .filter(key => keys.indexOf(key) >= 0)
    .reduce((newObj, key) => Object.assign(newObj, { [key]: obj[key] }), {});
});

module.exports.curry = curry;
