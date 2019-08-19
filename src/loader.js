const fs = require("fs")

module.exports.loadFile = path => {
  return fs.readFileSync(path, "utf8")
}

module.exports.writeFile = (path, source) => {
  fs.wrtieFileSync(path, source)
}
