const fs = require("fs")

module.exports.loadFile = path => {
  return fs.readFileSync(path, "utf8")
}
