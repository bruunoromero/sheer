const R = require("ramda");
const RandExp = require("randexp");
const escapeStringRegex = require("escape-string-regexp");

const makeRegex = spec => {
  return new RegExp(spec.matches);
};

const fuggerSpec = spec => {
  let _regx;
  const _spec = spec;

  return {
    spec() {
      return _spec;
    },
    regx() {
      if (!_regx) {
        _regx = new RandExp(makeRegex(spec));
      }

      return _regx;
    },
    gen() {
      return this.regx().gen();
    },
    wrap(v) {
      return this.trim(v, v);
    },
    trim(l, r) {
      return R.pipe(
        R.set(R.lensProp("trimLeft"), l),
        R.set(R.lensProp("trimRight"), r),
        fuggerSpec
      )(_spec);
    }
  };
};

const regex = matches => {
  if (matches instanceof RegExp) {
    return fuggerSpec({ matches });
  } else if (typeof matches === "string") {
    return fuggerSpec({ matches: new RegExp(matches) });
  }
};

const string = matches => {
  return fuggerSpec({ matches: escapeStringRegex(matches) });
};

module.exports = {
  string,
  regex
};
