import * as babelCore from "@babel/core";

import { preset } from "./preset";
import * as utils from "../utils";
import { SheerConfig } from "../project";
import { IrFile } from "../ir";
const traverse = require("./traverser");

export const compile = (file: IrFile, ns: string, config: SheerConfig) => {
  const filePath = utils.nameToPath(ns as string, config, true);
  const generated = babelCore.transformFromAstSync(
    traverse(file.program, { ns, ...config }),
    file.source,
    {
      filename: filePath,
      sourceFileName: file.path,
      sourceMaps: "inline",
      presets: [preset]
    } as any
  );

  return generated;
};
