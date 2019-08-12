const t = require("./types")

module.exports.definition = (name, isGlobal, value) => ({
  name,
  value,
  isGlobal,
  type: t.DEF
})
