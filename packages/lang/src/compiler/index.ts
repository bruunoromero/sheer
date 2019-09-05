import * as babelCore from "@babel/core";

import { preset } from "./preset";
import { SheerConfig } from "../project";
const traverse = require("./traverser");

export const compile = (file, ns, config: SheerConfig) => {
  const generated = babelCore.transformFromAst(
    traverse(file.program, { ns, ...config }),
    null,
    {
      presets: [preset]
    } as any
  );

  return { file, compiled: generated };
};
