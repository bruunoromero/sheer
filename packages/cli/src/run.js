const compiler = require("@yall/lang");
const { fork } = require("child_process");
const project = require("@yall/lang/src/project");

module.exports = () => {
  compiler();
  const config = project.config();

  fork(config.entryCompiled);
};
