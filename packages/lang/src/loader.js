const fs = require("fs");
const path = require("path");
const utils = require("./utils");

const ensureDirectoryExistence = filePath => {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
};

module.exports.loadFile = path => {
  return fs.readFileSync(path, "utf8");
};

module.exports.writeFile = (path, source) => {
  ensureDirectoryExistence(path);

  fs.writeFileSync(path, source);
};
