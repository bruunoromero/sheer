import { IrFile } from "./ir";

export class Dependency {
  _files: { [name: string]: IrFile };

  constructor() {
    this._files = {};
  }

  files(name?: string): IrFile | [string, IrFile][] {
    if (name) {
      return this._files[name];
    }

    return Object.entries(this._files);
  }

  addFile(file: IrFile) { 
    if (this._files[file.ns]) return;

    this._files[file.ns] = file;
  }
}
