import * as utils from "./utils";
import { File } from "./expander";

export class Dependency {
  _config: any;
  _files: { [name: string]: File };

  constructor(config: any) {
    this._config = config;
    this._files = {};
  }

  files(name?: string): any {
    if (name) {
      return this._files[name];
    }

    return Object.entries(this._files);
  }

  addFile(file: File) {
    const name = utils.pathToName(file.path, this._config);

    if (this._files[name]) return;

    this._files[name] = file;
  }
}
