const codeFrame = require("@babel/code-frame");

const errors = require("./errors");
const pt = require("../parser/types");

const invalidTypeProvided = (validator, fnName, arg, type) => {
  if (arg.type !== type) {
    validator.addError(
      arg.loc,
      errors.invalidTypeProvided(fnName, arg.type, type)
    );

    return false;
  }

  return true;
};

const forceEval = (...args) => args.every(e => e);

module.exports = (filename, source) => {
  _errors = [];

  return {
    addError(loc, message) {
      if (!loc) {
        _errors.push(message);
        return;
      }

      const err = codeFrame.codeFrameColumns(source, loc, { message });
      const formattedErr = `
Error found at ${filename}
${err}
`;
      _errors.push(formattedErr);
    },
    _errors() {
      return _errors;
    },
    errors() {
      return _errors.join("");
    }
  };
};

module.exports.def = (validator, meta, args) => {
  const EXPECTED_NUM_OF_ARGS = 2;

  if (args.length !== EXPECTED_NUM_OF_ARGS) {
    validator.addError(
      meta.loc,
      errors.invalidNumberOfArgs("def", args.length, EXPECTED_NUM_OF_ARGS)
    );

    return false;
  }

  return invalidTypeProvided(validator, "def", args[0], pt.SYMBOL);
};

module.exports.fn = (validator, meta, args) => {
  const MAX_NUM_OF_ARGS = 2;
  if (args.length < MAX_NUM_OF_ARGS) {
    validator.addError(
      meta.loc,
      errors.invalidNumberOfArgs("fn", args.length, MAX_NUM_OF_ARGS)
    );

    return false;
  }

  return invalidTypeProvided(validator, "fn", args[0], pt.VECTOR);
};

module.exports.defn = (validator, meta, args) => {
  const EXPECTED_NUM_OF_ARGS = 3;

  if (args.length < EXPECTED_NUM_OF_ARGS) {
    validator.addError(
      meta.loc,
      errors.atLeastNumberOfArguments("defn", args.length, EXPECTED_NUM_OF_ARGS)
    );

    return false;
  }

  return forceEval(
    invalidTypeProvided(validator, "defn", args[0], pt.SYMBOL),
    invalidTypeProvided(validator, "defn", args[1], pt.VECTOR)
  );
};

module.exports.ns = (validator, meta, args) => {
  // const EXPECTED_NUM_OF_ARGS = 2
  // if (args.length !== EXPECTED_NUM_OF_ARGS) {
  //   validator.addError(
  //     meta.loc,
  //     errors.invalidNumberOfArgs("def-", args.length, EXPECTED_NUM_OF_ARGS)
  //   )
  // }
};

module.exports.if_ = (validator, meta, args) => {
  const EXPECTED_NUM_OF_ARGS = 3;
  if (args.length !== EXPECTED_NUM_OF_ARGS) {
    validator.addError(
      meta.loc,
      errors.invalidNumberOfArgs("if", args.length, EXPECTED_NUM_OF_ARGS)
    );

    return false;
  }

  return true;
};

module.exports.when = (validator, meta, args) => {
  const EXPECTED_NUM_OF_ARGS = 2;
  if (args.length !== EXPECTED_NUM_OF_ARGS) {
    validator.addError(
      meta.loc,
      errors.invalidNumberOfArgs("when", args.length, EXPECTED_NUM_OF_ARGS)
    );

    return false;
  }

  return true;
};

module.exports.not = (validator, meta, args) => {
  const EXPECTED_NUM_OF_ARGS = 1;
  if (args.length !== EXPECTED_NUM_OF_ARGS) {
    validator.addError(
      meta.loc,
      errors.invalidNumberOfArgs("not", args.length, EXPECTED_NUM_OF_ARGS)
    );

    return false;
  }

  return true;
};

module.exports.notEq = (validator, meta, args) => {
  const EXPECTED_NUM_OF_ARGS = 1;

  if (args.length < EXPECTED_NUM_OF_ARGS) {
    validator.addError(
      meta.loc,
      errors.atLeastNumberOfArguments("not=", args.length, EXPECTED_NUM_OF_ARGS)
    );

    return false;
  }

  return true;
};

module.exports.ok = () => true;
