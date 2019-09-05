const fs = require("fs")
const path = require("path")
const decamelize = require("decamelize")
const utils = require("@sheer/lang/dist/utils.js")

const {
  DEFAULT_CONFIG,
  ENTRY_NAME
} = require("@sheer/lang/dist/project.js")

const buildJson = name => Object.assign({}, { name }, DEFAULT_CONFIG)

const DEFAULT_MAIN = '(log! "Hello, word")'

const coreSource = fs.readFileSync(
  require.resolve(`@${utils.EXT}/core/src/${utils.EXT}/core.${utils.EXT}`),
  "utf8"
)

module.exports = name => {
  const projectName = decamelize(name, "-")
  const projectJson = buildJson(projectName)
  const folderPath = path.resolve(name)

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath)
    fs.mkdirSync(path.join(folderPath, "src"))
    fs.mkdirSync(path.join(folderPath, utils.MODULES_FOLDER))
    fs.mkdirSync(path.join(folderPath, utils.MODULES_FOLDER, utils.EXT))
    fs.writeFileSync(
      path.join(folderPath, `.${utils.EXT}rc`),
      JSON.stringify(projectJson, null, 2)
    )

    fs.writeFileSync(
      path.join(folderPath, utils.MODULES_FOLDER, utils.EXT, "core.sheer"),
      coreSource
    )

    fs.writeFileSync(
      path.join(folderPath, projectJson.src, ENTRY_NAME),
      DEFAULT_MAIN
    )
  } else {
    console.log("folder already exists")
  }
}
