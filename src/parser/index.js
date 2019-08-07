const Language = require("./language")

module.exports.parse = source => {
  return Language.File.tryParse(source)
}
