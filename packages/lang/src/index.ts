import "source-map-support/register";

import * as fs from "fs";
import * as path from "path";
import * as rimraf from "rimraf";

import * as loader from "./loader";
import { loadProject, SheerConfig } from "./project";

import * as utils from "./utils";

import * as resolver from "./resolver";
import * as compiler from "./compiler";

import { IrFile, IrMeta } from "./ir";
import toposort = require("toposort");
import moment = require("moment");

type Meta = { name: string; file: IrFile; meta: IrMeta };

export const compileToIr = (path: string, config): any => {
  return loader.loadFile(path, config);
};

export const fromNsToIr = (ns: string, config: SheerConfig) => {
  const path = utils.nameToPath(ns, config);
  return compileToIr(path, config);
};

const traverseFolder = folderName => {
  if (!fs.existsSync(folderName)) return [];

  const allInFolder = fs
    .readdirSync(folderName)
    .map(p => path.join(folderName, p));

  const folders = allInFolder.filter(path => fs.lstatSync(path).isDirectory());

  const files = allInFolder.filter(path => !fs.lstatSync(path).isDirectory());

  return folders.reduce(
    (acc, folder) => acc.concat(traverseFolder(folder)),
    files
  );
};

export const loadFolder = (
  folderName: string,
  config: SheerConfig
): IrFile[] => {
  return traverseFolder(folderName).map(path => compileToIr(path, config));
};

const loadMetas = (folderName: string) => {
  return traverseFolder(folderName)
    .map(path => JSON.parse(fs.readFileSync(path, "utf8")))
    .filter((meta: IrMeta) => {
      return fs.existsSync(meta.path);
    });
};

const resolveFileSymbols = (name: string, file: IrFile, metas: any) => {
  const resolvedFile = resolver.transform(file, metas);

  return { name, file: resolvedFile, meta: resolvedFile.meta() };
};

const resolveSymbols = (sortedFiles: IrFile[], metas: IrMeta[]): Meta[] => {
  let _metas = metas;
  let parsed = [];

  for (let file of sortedFiles) {
    const meta = resolveFileSymbols(file.ns, file, _metas);
    parsed.push(meta);
    _metas = [..._metas, meta.meta];
  }

  return parsed;
};

const sortFiles = (files: IrFile[]) => {
  const genDep = (file: IrFile): [string, string][] => {
    return file
      .requires()
      .filter(([name]) => files.find(f => f.ns === name))
      .map(([name]) => [file.ns, name]);
  };

  const deps = files.map(file => genDep(file)).flat();

  return toposort
    .array(files.map(f => f.ns), deps)
    .sort()
    .reverse()
    .map(name => files.find(file => file.ns === name));
};

const filesToCompile = (files: IrFile[], metas: IrMeta[]) => {
  return files.filter(file => {
    const stat = fs.lstatSync(file.path);
    const meta = metas.find(meta => meta.path === file.path);

    if (!meta) {
      return true;
    }

    if (moment(stat.mtime).isAfter(meta.createdAt)) {
      return true;
    }

    return false;
  });
};

const deleteFiles = (files: IrFile[], config: SheerConfig) => {
  files.forEach(file => {
    const path = utils.nameToPath(file.ns, config, true);

    if (fs.existsSync(path)) {
      fs.unlinkSync(path);
    }
  });
};

export const compile = () => {
  const project = loadProject();

  try {
    const metas = loadMetas(project.config.metaSource);
    const files = loadFolder(project.config.rootSource, project.config);
    const modifiedFiles = filesToCompile(files, metas);

    deleteFiles(modifiedFiles, project.config);

    resolveSymbols(sortFiles(modifiedFiles), metas).forEach(meta => {
      const compiled = compiler.compile(meta.file, meta.name, project.config);
      const filePath = utils.nameToPath(meta.name, project.config, true);
      const metaPath = utils.nameToMetaPath(meta.name, project.config);

      loader.writeFile(filePath, compiled.code);
      loader.writeFile(metaPath, JSON.stringify(meta.meta, null, 2));
    });

    return project.config;
  } catch (e) {
    console.log(e);
    process.exit();
  }
};
