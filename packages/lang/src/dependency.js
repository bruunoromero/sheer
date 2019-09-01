const utils = require("./utils");

module.exports = config => {
  const _files = {};

  return {
    files(name) {
      if (name) {
        return _files[name];
      }

      return Object.entries(_files);
    },
    addFile(file) {
      const name = file.name() || utils.pathToName(file.path(), config);

      if (_files[name]) return;

      _files[name] = file;
    }
  };
};
