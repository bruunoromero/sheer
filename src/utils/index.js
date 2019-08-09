const path = require("path")

const pathNoExt = filePath => {
  const ext = path.extname(filePath)

  return filePath.slice(0, -ext.length)
}

module.exports.chunks = (array, chunkSize) => {
  const res = []

  for (let i = 0; i < array.length; i += chunkSize) {
    res.push(array.slice(i, i + chunkSize))
  }

  return res
}

module.exports.pathToName = (filePath, { rootSource }) => {
  const nonExt = pathNoExt(filePath)

  console.log(nonExt)
  return nonExt
    .replace(rootSource + path.sep, "")
    .split(path.sep)
    .join(".")
}
