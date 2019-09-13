const compiler = require("@sheer/lang")

module.exports = async () => {
  console.time("Done")

  await compiler.compile()

  console.timeEnd("Done")
}
