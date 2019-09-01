const colors = require("colors/safe");

const errorMessage = fn => (...args) => {
  return `\n${colors.red(fn.apply(null, args))}\n`;
};

module.exports.invalidNumberOfArgs = errorMessage(
  (fnName, argsNumber, expected) => {
    return `Invalid number of arguments for function \`${fnName}\`. Was expected \`${expected}\`, but was provided \`${argsNumber}\``;
  }
);

module.exports.invalidTypeProvided = errorMessage(
  (fnName, typeProvided, expected) => {
    return `Invalid argument provided for function \`${fnName}\`. Was expected type \`${expected}\`, but was provided type \`${typeProvided}\``;
  }
);

module.exports.atLeastNumberOfArguments = errorMessage(
  (fnName, argsNumber, expected) => {
    return `Invalid number of arguments for function \`${fnName}\`. Was expected at least \`${expected}\`, but was provided \`${argsNumber}\``;
  }
);
