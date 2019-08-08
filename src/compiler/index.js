const path = require("path")
const utils = require("../utils")
const parser = require("../parser")

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

module.exports.compile = (filePath, source, config) => {
  const program = parser.parse(source)
  const name = utils.pathToName(filePath, config, path.sep)

  return file(name, filePath, source, program)
}
