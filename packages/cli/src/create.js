const fs = require("fs");
const path = require("path");
const decamelize = require("decamelize");
const { DEFAULT_CONFIG, ENTRY_NAME } = require("@cris/lang/src/project.js");

const buildJson = name => Object.assign({}, { name }, DEFAULT_CONFIG);

const DEFAULT_MAIN = '(.log console "Hello, word")';

module.exports = name => {
  const projectName = decamelize(name, "-");
  const projectJson = buildJson(projectName);
  const folderPath = path.resolve(name);

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
    fs.mkdirSync(path.join(folderPath, "src"));
    fs.writeFileSync(
      path.join(folderPath, ".crisrc"),
      JSON.stringify(projectJson, null, 2)
    );

    fs.writeFileSync(
      path.join(folderPath, projectJson.src, ENTRY_NAME),
      DEFAULT_MAIN
    );
  } else {
    console.log("folder already exists");
  }
};
