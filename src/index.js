const loader = require("./loader")
const project = require("./project")
const compiler = require("./compiler")
const bootstrap = require("./bootstrap")

bootstrap()

const config = project.loadConfig()
const mainContent = loader.loadFile(config.mainPath)

console.log(compiler.compile(config.mainPath, mainContent, config).name())
