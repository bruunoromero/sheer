const path = require("path")

const ir = require("../ir")
const utils = require("../utils")
const parse = require("../parser")

const file = (name, path, source, program) => {
  const _name = name
  const _source = source
  const _program = program

  const _requires = {}
  const _definitions = {}

  return {
    name() {
      return _name
    },
    source() {
      return _source
    },
    program() {
      return _program
    },
    requires() {
      return _requires
    },
    definitions() {
      return _definitions
    },
    addRequired(name, as, file) {
      _requires[as || name] = {
        name,
        file
      }
    },
    addDefinition() {}
  }
}

module.exports = (filePath, source, config) => {
  try {
    const program = parse(source)
    const name = utils.pathToName(filePath, config, path.sep)
    const intermediate = ir(filePath, source, program)
    console.log(intermediate)
    return file(name, filePath, source, intermediate)
  } catch (e) {
    console.log(e)
  }
}
