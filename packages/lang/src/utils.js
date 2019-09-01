const fs = require("fs");
const path = require("path");

const EXT = "yall";
const OUT_EXT = "js";
const GLOBALS = "__$$GLOBALS$$__";
const CORE = "__$$YALL_LANG_CORE$$__";

const MODULES_FOLDER = `${EXT}_stuff`;

const fsName = name => name.split(".").join(path.sep);

const sourceFolder = ({ rootSource, outSource }, itOut) =>
  itOut ? outSource : rootSource;

const ext = isOut => (isOut ? OUT_EXT : EXT);

const addExt = (filePath, isOut) => {
  return `${filePath}.${ext(isOut)}`;
};

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
    .replace(sourceFolder(config, isOut) + path.sep, "")
    .split(path.sep)
    .join(".");
};

module.exports.nameToPath = (name, config, isOut) => {
  if (!isOut && config.projectRoot) {
    const modules = path.resolve(
      config.projectRoot,
      MODULES_FOLDER,
      fsName(name)
    );

    const depPath = addExt(modules, isOut);
    if (fs.existsSync(depPath)) return depPath;
  }

  const source = sourceFolder(config, isOut);
  const fileName = path.resolve(source, fsName(name));

  return addExt(fileName, isOut);
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
module.exports.MODULES_FOLDER = MODULES_FOLDER;

module.exports.pathNoExt = pathNoExt;
