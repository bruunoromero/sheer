const path = require("path");

const EXT = "cris";
const OUT_EXT = "js";
const GLOBALS = "__$$GLOBALS$$__";
const CORE = "__$$CRIS_LANG_CORE$$__";

const rootFolder = ({ rootSource, outSource }, itOut) =>
  itOut ? outSource : rootSource;

const ext = isOut => (isOut ? OUT_EXT : EXT);

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

module.exports.pathToName = (filePath, config, isOut) => {
  const nonExt = pathNoExt(filePath);

  return nonExt
    .replace(rootFolder(config, isOut) + path.sep, "")
    .split(path.sep)
    .join(".");
};

module.exports.nameToPath = (name, config, isOut) => {
  const root = rootFolder(config, isOut);

  const fileName = path.resolve(root, name.split(".").join(path.sep));

  return `${fileName}.${ext(isOut)}`;
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
module.exports.CORE = CORE;
module.exports.OUT_EXT = OUT_EXT;
module.exports.GLOBALS = GLOBALS;
module.exports.pathNoExt = pathNoExt;
