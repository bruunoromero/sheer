const utils = require("../utils");
const transformer = require("./transformer");

module.exports = parent => {
  let _name = null;
  const _defs = {};
  const _deps = [];
  const _exports = [];
  const _imports = {};
  const _requires = {};
  const _parent = parent;

  return {
    _defs() {
      return _defs;
    },
    deps() {
      return _deps;
    },
    root() {
      if (!_parent) return this;

      return _parent.root();
    },
    isRoot() {
      return this.root() === this;
    },
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
      const [owner, member] = name.split("/");
      const requires = this.requires();
      const required = requires[name];

      if (member) {
        return [
          transformer.symbol({ value: owner }),
          transformer.string(member)
        ];
      }

      if (!_defs[name] && _parent) {
        return _parent.resolve(name);
      } else if (_defs[name] && !_parent) {
        return [
          transformer.symbol({ value: utils.GLOBALS }),
          transformer.string(name)
        ];
      } else if (required) {
        if (required.isRefer) {
          if (required.as) {
            return [required.as, transformer.string(name)];
          } else {
            return [required.ns, transformer.string(name)];
          }
        }
      }

      return name;
    },
    exports() {
      if (this.isRoot()) {
        return _exports;
      }

      return this.root().exports();
    },
    requires() {
      if (this.isRoot()) {
        return _requires;
      }

      return this.root().requires();
    },
    imports() {
      if (this.isRoot()) {
        return _imports;
      }

      return this.root().imports();
    },
    definitions(name) {
      if (name) {
        return _defs[name];
      }

      return Object.keys(_defs);
    },
    addDefinition(name, isExportable, meta, isGlobal) {
      if (isGlobal) {
        this.root().addDefinition(name, isExportable, meta);
      } else {
        _defs[name] = meta;
      }

      if (isExportable && !_exports.find(n => n === name)) {
        _exports.push(name);
      }
    },
    addImport(meta) {
      if (this.isRoot()) {
        const path = meta.path.value;

        _imports[path] = meta;
      } else {
        this.root().addImport(name);
      }
    },
    addRequirement(meta) {
      if (this.isRoot()) {
        const ns = meta.ns.value;
        const asOrName = meta.as ? meta.as.value : ns;

        if (!_deps.find(n => n === ns)) {
          _deps.push(ns);
        }

        _requires[asOrName] = meta;

        if (meta.refer) {
          meta.refer.value.map(el => {
            _requires[el.value] = { ...meta, isRefer: true, fromNs: false };
          });
        }
      } else {
        this.root().addRequirement(name);
      }
    }
  };
};
