import { SheerConfig } from "./project";
import * as fs from "fs";
import * as R from "ramda";
import * as path from "path";
import * as cosmiconfig from "cosmiconfig";

import * as utils from "./utils";

export interface SheerConfig {
  tests: string;
  outSource: string;
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

let _config: SheerConfig | undefined;

const DEFAULT_CONFIG = {
  src: "src",
  out: "out",
  main: "main",
  tests: "tests",
  version: "0.0.1"
};

const searchConfig = (): RcConfig => {
  return cosmiconfig(utils.EXT).searchSync();
};

const buildConfig = ({ filepath, config, isEmpty }: RcConfig): SheerConfig => {
  const rcConfig = isEmpty ? {} : config;

  const projectRoot = path.dirname(filepath);
  const merdedConfig = R.mergeDeepLeft(rcConfig, DEFAULT_CONFIG);

  const outSource = path.join(projectRoot, merdedConfig.out);
  const rootSource = path.join(projectRoot, merdedConfig.src);
  const rootModules = path.join(projectRoot, utils.MODULES_FOLDER);

  return {
    outSource,
    rootSource,
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

export const loadConfig = () => {
  if (_config) return _config;

  const result = searchConfig();

  if (!result) {
    throw "Could not load configuration file";
  }

  _config = buildConfig(result);
  return _config;
};

const mainPath = (
  { main }: DefaultConfig,
  config: SheerConfig,
  isOut?: boolean
) => {
  return utils.nameToPath(main, config, isOut);
};

export const config = () => {
  return _config;
};
