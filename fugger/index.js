const R = require("ramda");
const RandExp = require("randexp");

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
    escape() {
      return fuggerSpec(R.set(R.lensProp("escaped"), true, _spec));
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

const fugger = matches => {
  return fuggerSpec({ matches });
};

module.exports = fugger;

console.log(fugger("[a-z]").wrap(10));
