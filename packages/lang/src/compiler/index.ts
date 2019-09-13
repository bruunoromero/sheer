import * as babelCore from "@babel/core";

import { preset } from "./preset";
import * as utils from "../utils";
import { Project } from "../project";
import { IrFile } from "../ir";
import * as traverser from "./traverser";

export const compile = (
  file: IrFile,
  ns: string,
  project: Project
): Promise<babelCore.BabelFileResult> => {
  const filePath = utils.nameToPath(ns as string, project.config, true);

  return babelCore.transformFromAstAsync(
    traverser.traverse(file, project, { ns: file.ns }),
    file.source,
    {
      filename: filePath,
      sourceFileName: file.path,
      sourceMaps: "inline",
      presets: [preset]
    } as any
  );
};
