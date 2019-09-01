const compiler = require("@yall/lang")
const { runCLI } = require("@jest/core")
const project = require("@yall/lang/src/project")
// Add any Jest configuration options here

module.exports = async () => {
  compiler()
  const config = project.config()
  const jestConfig = {
    testRegex: `${config.outSource}/${config.tests}/.*.js$`
  }

  const result = await runCLI(jestConfig, [config.projectRoot])
}
// Run the Jest asynchronously
