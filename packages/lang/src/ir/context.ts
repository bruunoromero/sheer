import * as utils from "../utils";
const transformer = require("./transformer");

export class Context {
  _deps: string[];
  _exports: string[];
  _name: string | null = null;
  _parent: Context | undefined;
  _defs: { [name: string]: any };
  _imports: { [name: string]: any };
  _requires: { [name: string]: any };

  constructor(parent?: Context) {
    this._parent = parent;

    this._deps = [];
    this._defs = {};
    this._exports = [];
    this._imports = {};
    this._requires = {};
  }

  defs() {
    return this._defs;
  }

  deps() {
    return this._deps;
  }

  root(): Context {
    if (!this._parent) return this;

    return this._parent.root();
  }

  isRoot(): boolean {
    return this.root() === this;
  }

  name(n: string) {
    if (n) {
      this._name = n;
    }

    return this._name;
  }

  has(name: string): boolean {
    if (this._defs[name]) return true;

    if (this._parent) return this._parent.has(name);

    return false;
  }

  resolve(name: string) {
    const [owner, member] = name.split("/");
    const requires = this.requires();
    const required = requires[name];

    if (member) {
      return [transformer.symbol({ value: owner }), transformer.string(member)];
    }

    if (!this._defs[name] && this._parent) {
      return this._parent.resolve(name);
    } else if (this._defs[name] && !this._parent) {
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
  }

  exports() {
    if (this.isRoot()) {
      return this._exports;
    }

    return this.root().exports();
  }

  requires() {
    if (this.isRoot()) {
      return this._requires;
    }

    return this.root().requires();
  }

  imports() {
    if (this.isRoot()) {
      return this._imports;
    }

    return this.root().imports();
  }

  definitions(name: string) {
    if (name) {
      return this._defs[name];
    }

    return Object.keys(this._defs);
  }

  addDefinition(
    name: string,
    isExportable: boolean,
    meta: any,
    isGlobal?: boolean
  ) {
    if (isGlobal) {
      this.root().addDefinition(name, isExportable, meta);
    } else {
      this._defs[name] = meta;
    }

    if (isExportable && !this._exports.find(n => n === name)) {
      this._exports.push(name);
    }
  }

  addImport(meta) {
    if (this.isRoot()) {
      const path = meta.path.value;

      this._imports[path] = meta;
    } else {
      this.root().addImport(name);
    }
  }

  addRequirement(meta) {
    if (this.isRoot()) {
      const ns = meta.ns.value;
      const asOrName = meta.as ? meta.as.value : ns;

      if (!this._deps.find(n => n === ns)) {
        this._deps.push(ns);
      }

      this._requires[asOrName] = meta;

      if (meta.refer) {
        meta.refer.value.map(el => {
          this._requires[el.value] = { ...meta, isRefer: true, fromNs: false };
        });
      }
    } else {
      this.root().addRequirement(name);
    }
  }
}
