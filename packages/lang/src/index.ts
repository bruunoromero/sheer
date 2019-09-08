import * as fs from "fs";
import * as path from "path";
import * as rimraf from "rimraf";

import * as loader from "./loader";
import { loadConfig, SheerConfig } from "./project";

import * as utils from "./utils";

import * as resolver from "./resolver";
import * as compiler from "./compiler";

import { Dependency } from "./dependency";
import { IrFile } from "./ir";

export const compileToIr = (path: string): any => {
  return loader.loadFile(path);
};

export const fromNsToIr = (ns: string, config: SheerConfig) => {
  const path = utils.nameToPath(ns, config);
  return compileToIr(path);
};

export const loadFolder = (
  folderName: string,
  depGraph: Dependency,
  config: SheerConfig
) => {
  if (!fs.existsSync(folderName)) return;

  const allInFolder = fs
    .readdirSync(folderName)
    .map(p => path.join(folderName, p));

  const folders = allInFolder.filter(path => fs.lstatSync(path).isDirectory());

  allInFolder
    .filter(path => !fs.lstatSync(path).isDirectory())
    .forEach(path => depGraph.addFile(compileToIr(path)));

  folders.forEach(folder => loadFolder(folder, depGraph, config));
};

export const compile = () => {
  const config = loadConfig();
  const depGraph = new Dependency();

  try {
    loadFolder(config.rootSource, depGraph, config);
    loadFolder(config.rootModules, depGraph, config);

    rimraf.sync(config.outSource);

    (resolver.transform(depGraph) as [string, IrFile][])
      .map(([ns, file]) => [ns, compiler.compile(file, ns, config)])
      .forEach(([ns, file]) => {
        const filePath = utils.nameToPath(ns as string, config, true);
        loader.writeFile(filePath, (file as any).compiled.code);
      });
  } catch (e) {
    console.log(e);
    process.exit();
  }
};
