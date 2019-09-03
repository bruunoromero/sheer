const compiler = require("@sheer/lang")
const { fork } = require("child_process")

const project = require("@sheer/lang/dist/src/project")

module.exports = () => {
  compiler.compile()
  const config = project.config()

  fork(config.entryCompiled)
}
