const fs = require("fs");
const R = require("ramda");
const path = require("path");
const cosmiconfig = require("cosmiconfig");

const utils = require("./utils");

const ENTRY_NAME = `main.${utils.EXT}`;

let _config;

const DEFAULT_CONFIG = {
  src: "src",
  out: "out",
  version: "0.0.1"
};

const searchConfig = () => {
  return cosmiconfig(utils.EXT).searchSync();
};

const buildConfig = ({ filepath, config, isEmpty }) => {
  const rcConfig = isEmpty ? {} : config;
  const merdedConfig = R.mergeDeepLeft(config, DEFAULT_CONFIG);
  const rootSource = path.join(path.dirname(filepath), merdedConfig.src);
  const outSource = path.join(path.dirname(filepath), merdedConfig.out);
  const entryCompiled = `${outSource}${path.sep}main.${utils.OUT_EXT}`;
  
  return {
    outSource,
    rootSource,
    entryCompiled,
    mainPath: mainPath(rootSource)
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

const mainPath = rootSource => {
  return path.join(rootSource, ENTRY_NAME);
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