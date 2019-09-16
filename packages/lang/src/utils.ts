import { SheerConfig } from "./project";
import * as fs from "fs-extra";
import * as path from "path";

export const EXT = "sheer";
export const OUT_EXT = "js";
export const GLOBALS = "__$$GLOBALS$$__";
export const RUNTIME = "__$$SHEER_LANG_RUNTIME$$__";

export const MODULES_FOLDER = `${EXT}_stuff`;
export const META_FOLDER = `.${EXT}_meta`;

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

export const nameToMetaPath = (name: string, config: SheerConfig) => {
  const fileName = path.resolve(config.metaSource, fsName(name));

  return `${fileName}.json`;
};

export const nameToPath = (
  name: string,
  config: SheerConfig,
  isOut?: boolean
): string => {
  const source = sourceFolder(config, isOut);
  const fileName = path.join(source, fsName(name));

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

export const traverseFolder = async (
  folderName: string
): Promise<[string, fs.Stats][]> => {
  const exists = await fs.pathExists(folderName);
  if (!exists) return [];

  const allInFolder = await Promise.all(
    (await fs.readdir(folderName))
      .map(p => path.join(folderName, p))
      .map(async p => [p, await fs.lstat(p)] as [string, fs.Stats])
  );

  const folders = allInFolder.filter(([path, stat]) => stat.isDirectory());
  const files = allInFolder.filter(([path, stat]) => !stat.isDirectory());

  return folders.reduce(
    async (acc, [path, stat]) => (await acc).concat(await traverseFolder(path)),
    Promise.resolve(files)
  );
};

export const tsort = (edges: [string, string][]) => {
  let nodes = {};
  let sorted = [];
  let visited = {};

  var Node = function(id: string) {
    this.id = id;
    this.afters = [];
  };

  edges.forEach(v => {
    var from = v[0],
      to = v[1];
    if (!nodes[from]) nodes[from] = new Node(from);
    if (!nodes[to]) nodes[to] = new Node(to);
    nodes[from].afters.push(to);
  });

  Object.keys(nodes).forEach(function visit(idstr, ancestors: number | any[]) {
    var node = nodes[idstr],
      id = node.id;

    if (visited[idstr]) return;

    let _ancerstors = Array.isArray(ancestors) ? ancestors : [];

    _ancerstors.push(id);

    visited[idstr] = true;

    node.afters.forEach(afterID => {
      if (_ancerstors.indexOf(afterID) >= 0)
        throw new Error("closed chain : " + afterID + " is in " + id);

      visit(
        afterID.toString(),
        _ancerstors.map(function(v) {
          return v;
        })
      );
    });

    sorted.unshift(id);
  });

  return sorted;
};
