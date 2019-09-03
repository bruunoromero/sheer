const compiler = require("@sheer/lang");
const { fork } = require("child_process");
const project = require("@sheer/lang/src/project");

module.exports = () => {
  compiler();
  const config = project.config();

  fork(config.entryCompiled);
};
