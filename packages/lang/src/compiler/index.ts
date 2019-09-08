import * as babelCore from "@babel/core";

import { preset } from "./preset";
import { SheerConfig } from "../project";
import { IrFile } from "../ir";
const traverse = require("./traverser");

export const compile = (file: IrFile, ns: string, config: SheerConfig) => {
  const generated = babelCore.transformFromAst(
    traverse(file.program, { ns, ...config }),
    null,
    {
      presets: [preset]
    } as any
  );

  return { file, compiled: generated };
};
