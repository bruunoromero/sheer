import * as utils from "./utils";

export class Dependency {
  _config: any;
  _files: { [name: string]: any };
  
  constructor(config: any) {
    this._config = config;
    this._files = {};
  }

  files(name?: string) {
    if (name) {
      return this._files[name];
    }

    return Object.entries(this._files);
  }

  addFile(file: any) {
    const name = file.name() || utils.pathToName(file.path(), this._config);

    if (this._files[name]) return;

    this._files[name] = file;
  }
}
