const fs = require("fs");
const R = require("ramda");
const path = require("path");
const cosmiconfig = require("cosmiconfig");

const utils = require("./utils");

const entryName = entry => `${entry}.${utils.EXT}`;
const ENTRY_NAME = entryName("main");

let _config;

const DEFAULT_CONFIG = {
  src: "src",
  out: "out",
  main: "main",
  tests: "tests",
  version: "0.0.1"
};

const searchConfig = () => {
  return cosmiconfig(utils.EXT).searchSync();
};

const buildConfig = ({ filepath, config, isEmpty }) => {
  const rcConfig = isEmpty ? {} : config;

  const projectRoot = path.dirname(filepath);
  const merdedConfig = R.mergeDeepLeft(rcConfig, DEFAULT_CONFIG);

  const outSource = path.join(projectRoot, merdedConfig.out);
  const rootSource = path.join(projectRoot, merdedConfig.src);
  const rootModules = path.join(projectRoot, utils.MODULES_FOLDER);

  return {
    outSource,
    rootSource,
    projectRoot,
    rootModules,
    tests: merdedConfig.tests,
    mainPath: mainPath(merdedConfig, { rootSource, projectRoot }),
    entryCompiled: mainPath(merdedConfig, { outSource, projectRoot }, true)
  };
};

const loadConfig = () => {
  if (_config) return _config;

  const result = searchConfig();

  if (!result) {
    throw "Could not load configuration file";
  }

  _config = buildConfig(result);
  return _config;
};

const mainPath = ({ main }, config, isOut) => {
  return utils.nameToPath(main, config, isOut);
};

const config = () => {
  return _config;
};

module.exports.config = config;
module.exports.mainPath = mainPath;
module.exports.loadConfig = loadConfig;
module.exports.buildConfig = buildConfig;
module.exports.searchConfig = searchConfig;

module.exports.ENTRY_NAME = ENTRY_NAME;
module.exports.DEFAULT_CONFIG = DEFAULT_CONFIG;
