const project = require("./project")
const compiler = require("./compiler")
const bootstrap = require("./bootstrap")

bootstrap()

console.log(project.loadConfig())

console.log(
  compiler
    .compile("testing.cris", "(a 1 x true false nil -1 -0.1 :a null) (a b)")
    .program()
)
