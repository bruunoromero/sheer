const codeFrame = require("@babel/code-frame");

const utils = require("../utils");
const errors = require("./errors");
const colors = require("colors/safe");
import { ParserType } from "../parser/types";

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

const accumulatingErrors = (...fns) => {
  return fns
    .map(fn => {
      try {
        return fn();
      } catch (e) {
        return false;
      }
    })
    .some(el => el === false);
};

export default (filename, source) => {
  const _errors = [];

  return {
    addError(loc, message) {
      if (!loc) {
        _errors.push(message);
        return;
      }

      const err = codeFrame.codeFrameColumns(source, loc, { message });
      const formattedErr = `\n
Error found at ${colors.red(filename)}\n
${err}
\n`;
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

// STATEMENTS

export const ns = (validator, meta, args) => {
  const EXPECTED_NUM_OF_ARGS = 1;
  if (args.length < EXPECTED_NUM_OF_ARGS) {
    validator.addError(
      meta.loc,
      errors.atLeastNumberOfArguments("ns", args.length, EXPECTED_NUM_OF_ARGS)
    );
  }
};

export const require_ = (validator, meta, args) => {
  const EXPECTED_NUM_OF_ARGS = 1;
  const VECTOR_MIN_NUMBER_OF_ELEMENTS = 1;

  return accumulatingErrors(
    () => {
      if (args.length !== EXPECTED_NUM_OF_ARGS) {
        validator.addError(
          meta.loc,
          errors.invalidNumberOfArgs(
            "require",
            args.length,
            EXPECTED_NUM_OF_ARGS
          )
        );

        return false;
      }
    },
    () => {
      if (
        !invalidTypeProvided(validator, "require", args[0], ParserType.VECTOR)
      )
        return false;
    },
    () => {
      if (args[0].value.length < VECTOR_MIN_NUMBER_OF_ELEMENTS) {
        validator.addError(
          args[0].loc,
          errors.atLeastNumberOfArguments(
            "require",
            args[0].value.length,
            VECTOR_MIN_NUMBER_OF_ELEMENTS
          )
        );

        return false;
      }
    },
    () => {
      const ns = args[0].value[0];
      const rest = utils.chunks(args[0].value.slice(1), 2);
      const as = rest.filter(el => el[0].value === "as")[0];
      const refer = rest.filter(el => el[0].value === "refer")[0];

      //TODO: Do something when as or refer has only one element

      return forceEval(
        invalidTypeProvided(validator, "require", ns, ParserType.SYMBOL),
        as
          ? invalidTypeProvided(validator, "require", as[0], ParserType.KEYWORD)
          : true,
        as
          ? invalidTypeProvided(validator, "require", as[1], ParserType.SYMBOL)
          : true,
        refer
          ? invalidTypeProvided(
              validator,
              "require",
              refer[0],
              ParserType.KEYWORD
            )
          : true,
        refer
          ? invalidTypeProvided(
              validator,
              "require",
              refer[1],
              ParserType.VECTOR
            )
          : true
      );
    }
  );
};

export const import_ = (validator, meta, args) => {
  const EXPECTED_NUM_OF_ARGS = 1;
  const VECTOR_NUMBER_OF_ELEMENTS = 3;

  return accumulatingErrors(
    () => {
      if (args.length !== EXPECTED_NUM_OF_ARGS) {
        validator.addError(
          meta.loc,
          errors.invalidNumberOfArgs(
            "import",
            args.length,
            EXPECTED_NUM_OF_ARGS
          )
        );

        return false;
      }
    },
    () => {
      if (!invalidTypeProvided(validator, "import", args[0], ParserType.VECTOR))
        return false;
    },
    () => {
      const imp = args[0].value;

      if (imp.length !== VECTOR_NUMBER_OF_ELEMENTS) {
        validator.addError(
          args[0].loc,
          errors.invalidNumberOfArgs(
            "import",
            imp.length,
            VECTOR_NUMBER_OF_ELEMENTS
          )
        );

        return false;
      }
    },
    () => {
      const imp = args[0].value;

      return forceEval(
        invalidTypeProvided(validator, "import", imp[0], ParserType.STRING),
        invalidTypeProvided(validator, "import", imp[1], ParserType.KEYWORD),
        invalidTypeProvided(validator, "import", imp[2], ParserType.SYMBOL)
      );
    }
  );
};

// DEFINITIONS

export const def = (validator, meta, args) => {
  const EXPECTED_NUM_OF_ARGS = 2;

  if (args.length !== EXPECTED_NUM_OF_ARGS) {
    validator.addError(
      meta.loc,
      errors.invalidNumberOfArgs("def", args.length, EXPECTED_NUM_OF_ARGS)
    );

    return false;
  }

  return invalidTypeProvided(validator, "def", args[0], ParserType.SYMBOL);
};

export const defn = (validator, meta, args) => {
  const EXPECTED_NUM_OF_ARGS = 3;

  if (args.length < EXPECTED_NUM_OF_ARGS) {
    validator.addError(
      meta.loc,
      errors.atLeastNumberOfArguments("defn", args.length, EXPECTED_NUM_OF_ARGS)
    );

    return false;
  }

  return forceEval(
    invalidTypeProvided(validator, "defn", args[0], ParserType.SYMBOL),
    invalidTypeProvided(validator, "defn", args[1], ParserType.VECTOR)
  );
};

// EXPRESSIONS

export const fn = (validator, meta, args) => {
  const MAX_NUM_OF_ARGS = 2;
  if (args.length < MAX_NUM_OF_ARGS) {
    validator.addError(
      meta.loc,
      errors.invalidNumberOfArgs("fn", args.length, MAX_NUM_OF_ARGS)
    );

    return false;
  }

  return invalidTypeProvided(validator, "fn", args[0], ParserType.VECTOR);
};

export const if_ = (validator, meta, args) => {
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

export const when = (validator, meta, args) => {
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

export const not = (validator, meta, args) => {
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

export const notEq = (validator, meta, args) => {
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

export const ok = () => true;
