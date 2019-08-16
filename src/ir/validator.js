const codeFrame = require("@babel/code-frame")

const errors = require("./errors")

module.exports = (filename, source) => {
  _errors = []

  return {
    addError(loc, message) {
      if (!loc) {
        _errors.push(message)
        return
      }

      const err = codeFrame.codeFrameColumns(source, loc, { message })
      const formattedErr = `
Error found at ${filename}
${err}
`
      _errors.push(formattedErr)
    },
    errors() {
      return _errors.join("")
    }
  }
}

module.exports.ok = () => {}

module.exports.def = (validator, meta, args) => {
  const EXPECT_NUM_OF_ARGS = 2

  if (args.length !== EXPECT_NUM_OF_ARGS) {
    validator.addError(
      meta.loc,
      errors.invalidNumberOfArgs("def", args.length, EXPECT_NUM_OF_ARGS)
    )
  }
}

module.exports.defp = (validator, meta, args) => {
  const EXPECT_NUM_OF_ARGS = 2

  if (args.length !== EXPECT_NUM_OF_ARGS) {
    validator.addError(
      meta.loc,
      errors.invalidNumberOfArgs("def-", args.length, EXPECT_NUM_OF_ARGS)
    )
  }
}

module.exports.ns = (validator, meta, args) => {
  // const EXPECT_NUM_OF_ARGS = 2
  // if (args.length !== EXPECT_NUM_OF_ARGS) {
  //   validator.addError(
  //     meta.loc,
  //     errors.invalidNumberOfArgs("def-", args.length, EXPECT_NUM_OF_ARGS)
  //   )
  // }
}


module.exports.if_ = (validator, meta, args) => {
  const EXPECT_NUM_OF_ARGS = 3
  if (args.length !== EXPECT_NUM_OF_ARGS) {
    validator.addError(
      meta.loc,
      errors.invalidNumberOfArgs("if", args.length, EXPECT_NUM_OF_ARGS)
    )
  }
}

module.exports.when = (validator, meta, args) => {
  const EXPECT_NUM_OF_ARGS = 2
  if (args.length !== EXPECT_NUM_OF_ARGS) {
    validator.addError(
      meta.loc,
      errors.invalidNumberOfArgs("when", args.length, EXPECT_NUM_OF_ARGS)
    )
  }
}
