const fs = require("fs")
const path = require("path")
const cosmiconfig = require("cosmiconfig")

const ENTRY_NAME = "main.cris"

let _config

const loadConfig = () => {
  if (_config) return _config

  const explorer = cosmiconfig("cris")
  const result = explorer.searchSync()

  if (!result) {
    throw "Could not load configuration file"
  }

  _config = result
  return result
}

const mainPath = ({ config, isEmpty, filepath }) => {
  return path.join(path.dirname(filepath), config.src, ENTRY_NAME)
}

const config = () => {
  return _config
}

module.exports.config = config
module.exports.mainPath = mainPath
module.exports.loadConfig = loadConfig
