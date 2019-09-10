const compiler = require("@sheer/lang")
const { runCLI } = require("@jest/core")
const project = require("@sheer/lang/dist/project")

module.exports = async () => {
  const config = compiler.compile()
  const jestConfig = {
    testRegex: `${config.outSource}/${config.tests}/.*.js$`
  }

  await runCLI(jestConfig, [config.projectRoot])
}
