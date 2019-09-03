import * as fs from "fs";
import * as path from "path";
import * as rimraf from "rimraf";

import * as loader from "./loader";
import { loadConfig, SheerConfig } from "./project";

import ir from "./ir";
import * as utils from "./utils";
import { parse } from "./parser";

import * as compiler from "./compiler";

import { Dependency } from "./dependency";

export const compileToIr = (
  path: string,
  depGraph: Dependency,
  config: SheerConfig
): any => {
  try {
    const source = loader.loadFile(path);
    const program = parse(source);

    const file = ir(path, source, program);

    depGraph.addFile(file);

    return file;
  } catch (e) {
    console.log(e);
  }
};

export const fromNsToIr = (
  ns: string,
  depGraph: Dependency,
  config: SheerConfig
) => {
  const path = utils.nameToPath(ns, config);
  return compileToIr(path, depGraph, config);
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

  const files = allInFolder
    .filter(path => !fs.lstatSync(path).isDirectory())
    .forEach(path => compileToIr(path, depGraph, config));

  folders.forEach(folder => loadFolder(folder, depGraph, config));
};

export const compile = () => {
  const config = loadConfig();
  const depGraph = new Dependency(config);

  try {
    loadFolder(config.rootSource, depGraph, config);
    loadFolder(config.rootModules, depGraph, config);

    rimraf.sync(config.outSource);

    const files = depGraph
      .files()
      .map(([ns, file]) => [ns, compiler(file, ns, config)])
      .forEach(([ns, file]) => {
        const filePath = utils.nameToPath(ns, config, true);
        loader.writeFile(filePath, file.compiled.code);
      });
  } catch (e) {
    console.log(e);
    process.exit();
  }
};
