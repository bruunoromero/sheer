const path = require("path");

const EXT = "cris";
const GLOBALS = "__$$GLOBALS$$__";

const pathNoExt = filePath => {
  const ext = path.extname(filePath);

  return filePath.slice(0, -ext.length);
};

module.exports.chunks = (array, chunkSize) => {
  const res = [];

  for (let i = 0; i < array.length; i += chunkSize) {
    res.push(array.slice(i, i + chunkSize));
  }

  return res;
};

module.exports.pathToName = (filePath, { rootSource }) => {
  const nonExt = pathNoExt(filePath);

  return nonExt
    .replace(rootSource + path.sep, "")
    .split(path.sep)
    .join(".");
};

module.exports.nameToPath = (name, { rootSource }) => {
  return `${path.resolve(rootSource, name.split(".").join(path.sep))}.${EXT}`;
};

module.exports.normalizeName = name => {
  return name
    .replace(/-/g, "_")
    .replace(/>/g, "_GT_")
    .replace(/</g, "_LT_")
    .replace(/=/g, "_EQ_")
    .replace(/!/g, "_BANG_")
    .replace(/\./g, "_DOT_")
    .replace(/\|/g, "_PIPE_")
    .replace(/\*/g, "_STAR_")
    .replace(/\+/g, "_PLUS_")
    .replace(/\?/g, "_QMARK_")
    .replace(/\//g, "_FSLASH_")
    .replace(/\\/g, "_BSLASH_");
};

module.exports.unnormalizeName = name => {
  return name
    .replace(/_GT_/g, ">")
    .replace(/_LT_/g, "<")
    .replace(/_EQ_/g, "=")
    .replace(/_DOT_/g, ".")
    .replace(/_PIPE_/g, "|")
    .replace(/_BANG_/g, "!")
    .replace(/_STAR_/g, "*")
    .replace(/_PLUS_/g, "+")
    .replace(/_QMARK_/g, "?")
    .replace(/_FSLASH_/g, "/")
    .replace(/_BSLASH_/g, "\\")
    .replace(/_/g, "-");
};

module.exports.EXT = EXT;
module.exports.GLOBALS = GLOBALS;
module.exports.pathNoExt = pathNoExt;
