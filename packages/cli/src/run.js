const compiler = require("@sheer/lang")
const { fork } = require("child_process")

module.exports = async () => {
  console.time("Done")
  const config = await compiler.compile()
  const command = fork(config.entryCompiled)

  command.on("exit", function(code) {
    console.log("")
    console.timeEnd("Done")
  })
}
