import "source-map-support/register";
import * as fs from "fs-extra";
import * as path from "path";
import * as compiler from "./compiler";
import { IrFile, IrMeta } from "./ir";
import * as loader from "./loader";
import { loadProject, SheerConfig, Project } from "./project";
import * as resolver from "./resolver";
import * as utils from "./utils";
import * as R from "ramda";
import moment = require("moment");
import { ensureDir } from "fs-extra";

type Meta = { name: string; file: IrFile; meta: IrMeta };

export const compileToIr = (path: string, project: Project): any => {
  return loader.loadFile(path, project.config);
};

export const fromNsToIr = (ns: string, project: Project) => {
  const path = utils.nameToPath(ns, project.config);
  return compileToIr(path, project);
};

export const loadFolder = async (
  metas: IrMeta[],
  folderName: string,
  project: Project
): Promise<string[]> => {
  const files = await utils.traverseFolder(folderName);

  const jsFiles = files.filter(
    ([filePath]) => path.extname(filePath) === ".js"
  );

  await ensureDir(project.config.outSource);

  await Promise.all(
    jsFiles.map(async ([filePath]) => {
      await fs.ensureFile(
        filePath.replace(project.config.rootSource, project.config.outSource)
      );

      return await fs.copyFile(
        filePath,
        filePath.replace(project.config.rootSource, project.config.outSource)
      );
    })
  );

  return files
    .filter(([filePath, stat]) => {
      if (path.extname(filePath) !== ".sheer") return false;

      const meta = metas.find(meta => meta.path === filePath);

      if (!meta) {
        return true;
      }

      if (moment(stat.mtime).isAfter(meta.createdAt)) {
        return true;
      }

      return false;
    })
    .map(([path]) => path);
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
  if (files.length === 1) {
    return files;
  }

  const genDep = (file: IrFile): [string, string][] => {
    return file.requires().map(([name, req]) => [file.ns, req.ns.value]);
  };

  return utils
    .tsort(
      files
        .map(file => genDep(file))
        .reduce((acc, curr) => acc.concat(curr), [])
    )
    .reverse()
    .map(name => files.find(file => file.ns === name))
    .filter(e => e);
};

export const compile = async () => {
  const project = await loadProject();

  try {
    const changedFiles = await loadFolder(
      project.metas,
      project.config.rootSource,
      project
    );

    const changedNs = changedFiles.map(path =>
      utils.pathToName(path, project.config)
    );

    const pathsToCompile = project.metas
      .filter(meta => {
        return meta.requires.some(ns => changedNs.indexOf(ns) !== -1);
      })
      .map(meta => meta.path)
      .concat(changedFiles);

    const filesToCompile = await Promise.all(
      pathsToCompile.map(path => compileToIr(path, project))
    );

    const compilations = resolveSymbols(
      sortFiles(filesToCompile),
      project.metas.filter(meta =>
        changedFiles.some(path => path !== meta.path)
      )
    ).map(async meta => {
      const compiled = await compiler.compile(meta.file, meta.name, project);
      const filePath = utils.nameToPath(meta.name, project.config, true);
      const metaPath = utils.nameToMetaPath(meta.name, project.config);

      return Promise.all([
        loader.writeFile(filePath, compiled.code),
        loader.writeFile(metaPath, JSON.stringify(meta.meta, null, 2))
      ]);
    });

    await Promise.all(compilations);

    return project.config;
  } catch (e) {
    console.log(e);
    process.exit();
  }
};
