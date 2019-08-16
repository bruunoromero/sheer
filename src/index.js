const loader = require("./loader")
const project = require("./project")
const compile = require("./compiler")

const config = project.loadConfig()
const mainContent = loader.loadFile(config.mainPath)

const file = compile(config.mainPath, mainContent, config)

if (file) {
  // console.log(file)
}
