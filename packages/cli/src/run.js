const compiler = require("@cris/lang");
const { fork } = require("child_process");
const project = require("@cris/lang/src/project");

module.exports = () => {
  compiler();
  const config = project.config();

  fork(config.entryCompiled);
};
