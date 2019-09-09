import * as fs from "fs";
import * as path from "path";

import * as ir from "./ir";
import * as parser from "./parser";
import * as expander from "./expander";

const ensureDirectoryExistence = (filePath: string) => {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return;
  }

  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
};

export const loadFile = (path: string): ir.IrFile => {
  const source = fs.readFileSync(path, "utf8");
  const program = parser.transform(source);

  const file = expander.transform(path, source, program);

  return ir.transform(file);
};

export const writeFile = (path: string, source: string) => {
  ensureDirectoryExistence(path);

  fs.writeFileSync(path, source);
};
