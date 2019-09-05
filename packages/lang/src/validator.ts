import * as colors from "colors/safe";
import * as codeFrame from "@babel/code-frame";

import { Location } from "./parser/ast";

export class Validator {
  private _source: string;
  private _errors: string[];
  private _filename: string;

  constructor(source: string, filename: string) {
    this._errors = [];
    this._source = source;
    this._filename = filename;
  }

  addError(loc: Location, message: string) {
    if (!loc) {
      this._errors.push(message);
      return;
    }

    const err = codeFrame.codeFrameColumns(this._source, loc, { message });
    const formattedErr = `\n
Error found at ${colors.red(this._filename)}\n
${err}
\n`;
    this._errors.push(formattedErr);
  }

  get errors() {
    return this._errors.join("");
  }
}
