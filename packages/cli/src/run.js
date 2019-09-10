const compiler = require("@sheer/lang")
const { fork } = require("child_process")

const project = require("@sheer/lang/dist/project")

module.exports = () => {
  console.time("Done")
  const config = compiler.compile()
  const command = fork(config.entryCompiled)

  command.on("exit", function(code) {
    console.log("")
    console.timeEnd("Done")
  })
}
