const compiler = require("@sheer/lang")
const { runCLI } = require("@jest/core")

module.exports = async () => {
  const config = await compiler.compile()
  const jestConfig = {
    testRegex: `${config.outSource}/${config.tests}/.*.js$`
  }

  await runCLI(jestConfig, [config.projectRoot])
}
