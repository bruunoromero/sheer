import * as cosmiconfig from "cosmiconfig";
import * as fs from "fs-extra";
import * as path from "path";
import * as R from "ramda";
import * as utils from "./utils";
import moment = require("moment");
import allSettled = require("promise.allsettled");
import { IrMeta } from "./ir";

export interface SheerConfig {
  tests: string;
  outSource: string;
  metaSource: string;
  rootSource: string;
  projectRoot: string;
  rootModules: string;
  entryCompiled: string;
}

interface DefaultConfig {
  src?: string;
  out?: string;
  main?: string;
  tests?: string;
  version?: string;
}

interface RcConfig {
  filepath: string;
  isEmpty: boolean;
  config: DefaultConfig;
}

const entryName = entry => `${entry}.${utils.EXT}`;
export const ENTRY_NAME = entryName("main");

const DEFAULT_CONFIG = {
  src: "src",
  out: "out",
  main: "main",
  tests: "tests",
  version: "0.0.1"
};

const searchConfig = (): Promise<RcConfig> => {
  return cosmiconfig(utils.EXT).search();
};

const nodeModulesChanged = async () => {
  const depsFile = path.join(process.cwd(), utils.META_FOLDER, ".deps.json");

  if (await fs.pathExists(depsFile)) {
    const [moduleStat, depsStat] = await Promise.all([
      fs.lstat(path.join(process.cwd(), "node_modules")),
      fs.lstat(depsFile)
    ]);

    return moment(moduleStat.mtime).isAfter(depsStat.mtime);
  }

  return true;
};

const searchDependenciesConfig = async (folderPath = "node_modules") => {
  const modulesPath = path.join(process.cwd(), folderPath);
  const dirs = await fs.readdir(modulesPath);
  const searchs = dirs.map(async dirName => {
    if (dirName[0] === "@") {
      return (await searchDependenciesConfig(
        path.join(folderPath, dirName)
      )).flat();
    }

    return await cosmiconfig(utils.EXT, { stopDir: modulesPath }).search(
      path.join(modulesPath, dirName)
    );
  });

  const deps = (await allSettled(searchs))
    .flat()
    .filter(result => result.status === "fulfilled")
    .map((result: any) => result.value)
    .filter(result => result);

  return deps.flat();
};

const buildConfig = ({ filepath, config, isEmpty }: RcConfig): SheerConfig => {
  const rcConfig = isEmpty ? {} : config;

  let projectRoot = path.dirname(filepath).replace(process.cwd(), "");

  if (projectRoot.startsWith("/node_modules/")) {
    projectRoot = projectRoot.replace("/node_modules/", "");
  }

  const merdedConfig = R.mergeDeepLeft(rcConfig, DEFAULT_CONFIG);

  const outSource = path.join(projectRoot, merdedConfig.out);
  const rootSource = path.join(projectRoot, merdedConfig.src);
  const metaSource = path.join(projectRoot, utils.META_FOLDER);
  const rootModules = path.join(projectRoot, utils.MODULES_FOLDER);

  return {
    outSource,
    rootSource,
    metaSource,
    projectRoot,
    rootModules,
    tests: merdedConfig.tests,
    entryCompiled: mainPath(
      merdedConfig,
      { outSource, projectRoot } as SheerConfig,
      true
    )
  };
};

const loadMetas = async (folderName: string): Promise<IrMeta[]> => {
  const files = await utils.traverseFolder(folderName);
  const jsons = await Promise.all(
    files
      .filter(([path]) => {
        return !path.endsWith(".deps.json");
      })
      .map(([path]) => fs.readJSON(path))
  );

  return jsons.flat().filter((meta: IrMeta) => {
    return fs.pathExists(meta.path);
  });
};

export const loadProject = async () => {
  const depsFile = path.join(process.cwd(), utils.META_FOLDER, ".deps.json");
  const result = await searchConfig();

  if (!result) {
    throw "Could not load configuration file";
  }

  const config = buildConfig(result);
  const hasChanged = await nodeModulesChanged();

  let deps: [SheerConfig, IrMeta[]][];
  let depsMetas: IrMeta[];
  if (hasChanged) {
    const depsConfigs = (await searchDependenciesConfig()).map(buildConfig);

    depsMetas = await Promise.all(
      depsConfigs.map(config =>
        loadMetas(path.join(process.cwd(), "node_modules", config.metaSource))
      )
    );

    deps = depsConfigs.map((config, index) => {
      return [config, depsMetas[index]];
    });

    await fs.ensureFile(depsFile);
    await fs.writeJSON(depsFile, deps);
  } else {
    deps = await fs.readJSON(depsFile);

    depsMetas = deps.map(([config, metas]) => metas.flat()).flat();
  }

  const projectMetas = await loadMetas(
    path.join(process.cwd(), config.metaSource)
  );

  return new Project(
    config,
    projectMetas
      .flat()
      .concat(depsMetas)
      .flat(),
    deps
  );
};

const mainPath = (
  { main }: DefaultConfig,
  config: SheerConfig,
  isOut?: boolean
) => {
  return utils.nameToPath(main, config, isOut);
};

export class Project {
  constructor(
    public readonly config: SheerConfig,
    public readonly metas: IrMeta[],
    public readonly deps: [SheerConfig, IrMeta[]][]
  ) {}
}
