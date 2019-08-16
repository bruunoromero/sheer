const errorMessage = fn => (...args) => {
  return `\n${fn.apply(null, args)}\n`
}

module.exports.invalidNumberOfArgs = errorMessage(
  (fnName, argsNumber, expected) => {
    return `Invalid number of arguments for function \`${fnName}\`. Was expected \`${expected}\`, but was provided \`${argsNumber}\``
  }
)
