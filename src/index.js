const loader = require("./loader")
const project = require("./project")
const compiler = require("./compiler")
const bootstrap = require("./bootstrap")

bootstrap()

const rc = project.loadConfig()
const mainPath = project.mainPath(rc)
const mainContent = loader.loadFile(mainPath)

console.log(compiler.compile(mainPath, mainContent).program())
