import * as path from "path";
import * as fs from "fs-extra";

import * as ir from "./ir";
import * as parser from "./parser";
import * as expander from "./expander";
import { SheerConfig } from "./project";

export const loadFile = async (
  path: string,
  config: SheerConfig
): Promise<ir.IrFile> => {
  const source = await fs.readFile(path, "utf8");
  const program = parser.transform(source);

  const file = expander.transform(path, source, program, config);

  return ir.transform(file, config);
};

export const writeFile = async (filePath: string, source: string) => {
  const dirname = path.dirname(filePath);

  await fs.ensureDir(dirname);
  fs.writeFile(filePath, source);
};
