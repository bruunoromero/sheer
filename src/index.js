const loader = require("./loader");
const project = require("./project");
const compile = require("./compiler");

// const config = project.loadConfig();
// const mainContent = loader.loadFile(config.mainPath);

// const compiled = compile(config.mainPath, mainContent, config);

module.exports = { loader, project, compile };
