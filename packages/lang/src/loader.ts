import * as fs from "fs";
import * as path from "path";
import * as utils from "./utils";

const ensureDirectoryExistence = (filePath: string) => {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return;
  }

  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
};

export const loadFile = (path: string): string => {
  return fs.readFileSync(path, "utf8");
};

export const writeFile = (path: string, source: string) => {
  ensureDirectoryExistence(path);

  fs.writeFileSync(path, source);
};
