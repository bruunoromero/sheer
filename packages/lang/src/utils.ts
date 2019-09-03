import { SheerConfig } from "./project";
import * as fs from "fs";
import * as path from "path";

export const EXT = "sheer";
export const OUT_EXT = "js";
export const GLOBALS = "__$$GLOBALS$$__";
export const CORE = "__$$SHEER_LANG_CORE$$__";

export const MODULES_FOLDER = `${EXT}_stuff`;

const fsName = name => name.split(".").join(path.sep);

const sourceFolder = (
  { rootSource, outSource }: SheerConfig,
  itOut?: boolean
): string => (itOut ? outSource : rootSource);

const ext = isOut => (isOut ? OUT_EXT : EXT);

const addExt = (filePath: string, isOut?: boolean) => {
  return `${filePath}.${ext(isOut)}`;
};

export const pathNoExt = (filePath: string): string => {
  const ext = path.extname(filePath);

  return filePath.slice(0, -ext.length);
};

export const chunks = <T>(array: T[], chunkSize: number): T[][] => {
  const res = [];

  for (let i = 0; i < array.length; i += chunkSize) {
    res.push(array.slice(i, i + chunkSize));
  }

  return res;
};

export const pathToName = (
  filePath: string,
  config: SheerConfig,
  isOut?: boolean
): string => {
  const nonExt = pathNoExt(filePath);

  return nonExt
    .replace(sourceFolder(config, isOut) + path.sep, "")
    .split(path.sep)
    .join(".");
};

export const nameToPath = (
  name: string,
  config: SheerConfig,
  isOut?: boolean
): string => {
  if (!isOut && config.projectRoot) {
    const modules = path.resolve(
      config.projectRoot,
      MODULES_FOLDER,
      fsName(name)
    );

    const depPath = addExt(modules, isOut);
    if (fs.existsSync(depPath)) return depPath;
  }

  const source = sourceFolder(config, isOut);
  const fileName = path.resolve(source, fsName(name));

  return addExt(fileName, isOut);
};

export const normalizeName = (name: string): string => {
  return name
    .replace(/-/g, "_")
    .replace(/>/g, "_GT_")
    .replace(/</g, "_LT_")
    .replace(/=/g, "_EQ_")
    .replace(/!/g, "_BANG_")
    .replace(/\./g, "_DOT_")
    .replace(/\|/g, "_PIPE_")
    .replace(/\*/g, "_STAR_")
    .replace(/\+/g, "_PLUS_")
    .replace(/\?/g, "_QMARK_")
    .replace(/\//g, "_FSLASH_")
    .replace(/\\/g, "_BSLASH_");
};

export const unnormalizeName = (name: string): string => {
  return name
    .replace(/_GT_/g, ">")
    .replace(/_LT_/g, "<")
    .replace(/_EQ_/g, "=")
    .replace(/_DOT_/g, ".")
    .replace(/_PIPE_/g, "|")
    .replace(/_BANG_/g, "!")
    .replace(/_STAR_/g, "*")
    .replace(/_PLUS_/g, "+")
    .replace(/_QMARK_/g, "?")
    .replace(/_FSLASH_/g, "/")
    .replace(/_BSLASH_/g, "\\")
    .replace(/_/g, "-");
};
