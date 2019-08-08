module.exports.chunks = (array, chunkSize) => {
  const res = []

  for (let i = 0; i < array.length; i += chunkSize) {
    res.push(array.slice(i, i + chunkSize))
  }

  return res
}

module.exports.pathToName = (filePath, { rootSource }, sep) => {
  const nonExt = filePath.split(".")[0]

  return nonExt
    .replace(rootSource + sep, "")
    .split(sep)
    .join(".")
}
