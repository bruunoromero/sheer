import * as fs from "fs";
import * as path from "path";
import * as babelCore from "@babel/core";

import { preset } from "./preset";
const traverse = require("./traverser");

export const compile = (file, ns, config) => {
  const generated = babelCore.transformFromAst(
    traverse(file.program(), { ns, ...config }),
    null,
    {
      presets: [preset]
    } as any
  );

  return { file, compiled: generated };
};
