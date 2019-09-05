import * as colors from "colors/safe";

const errorMessage = (fn: (...args: any[]) => string) => (...args: any[]) => {
  return `\n${colors.red(fn.apply(null, args))}\n`;
};

export const invalidNumberOfArgs = errorMessage(
  (fnName: string, argsNumber: number, expected: number) => {
    return `Invalid number of arguments for function \`${fnName}\`. Was expected \`${expected}\`, but was provided \`${argsNumber}\``;
  }
);

export const invalidTypeProvided = errorMessage(
  (fnName: string, typeProvided: string, expected: string) => {
    return `Invalid argument provided for function \`${fnName}\`. Was expected type \`${expected}\`, but was provided type \`${typeProvided}\``;
  }
);

export const atLeastNumberOfArguments = errorMessage(
  (fnName: string, argsNumber: string, expected: string) => {
    return `Invalid number of arguments for function \`${fnName}\`. Was expected at least \`${expected}\`, but was provided \`${argsNumber}\``;
  }
);
