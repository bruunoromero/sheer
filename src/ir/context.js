const utils = require("../utils");

module.exports = parent => {
  let _name = null;
  const _defs = {};
  const _exports = [];
  const _requires = {};
  const _parent = parent;

  return {
    name(n) {
      if (n) {
        _name = n;
      }

      return _name;
    },
    has(name) {
      if (_defs[name]) return true;

      if (_parent) return _parent.has(name);

      return false;
    },
    resolve(name) {
      if (_defs[name] && !_parent) {
        return [utils.GLOBALS, name];
      }

      return name;
    },
    exports() {
      return _exports;
    },
    requires() {
      return _requires;
    },
    definitions(name) {
      if (name) {
        return _defs[name];
      }

      return Object.keys(_defs);
    },
    addDefinition(name, isExportable, meta) {
      _defs[name] = meta;

      if (isExportable && !_exports.find(n => n === name)) {
        _exports.push(name);
      }
    },
    addRequirement(name) {}
  };
};
