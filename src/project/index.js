const fs = require("fs")
const cosmiconfig = require("cosmiconfig")

const loadConfig = () => {
  const explorer = cosmiconfig("cris")
  const result = explorer.searchSync()

  if (!result) {
    throw "Could not load configuration file"
  }

  return result
}

const loadMain = () => {
  const result = loadConfig()
  
}

module.exports.loadMain = loadMain
module.exports.loadConfig = loadConfig
