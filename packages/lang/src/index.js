const fs = require("fs");
const path = require("path");
const rimraf = require("rimraf");

const loader = require("./loader");
const project = require("./project");

const ir = require("./ir");
const utils = require("./utils");
const parse = require("./parser");

const compile = require("./compiler");

const dependency = require("./dependency");

const compileToIr = (path, depGraph, config) => {
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

const fromNsToIr = (ns, depGraph, config) => {
  const path = utils.nameToPath(ns, config);
  return compileToIr(path, depGraph, config);
};

const loadFromDeps = (deps, depGraph, config) => {
  const toLoadDeps = deps
    .map(ns => fromNsToIr(ns, depGraph, config))
    .map(f => f.deps())
    .flat()
    .filter((v, i, arr) => arr.indexOf(v) === i)
    .filter(ns => !depGraph.files(ns));

  if (!toLoadDeps.length) return;

  loadFromDeps(toLoadDeps, depGraph, config);
};

const loadFolder = (folderName, depGraph, config) => {
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

module.exports = () => {
  const config = project.loadConfig();
  const depGraph = dependency(config);

  try {
    loadFolder(config.rootSource, depGraph, config);
    loadFolder(config.rootModules, depGraph, config);

    rimraf.sync(config.outSource);

    const files = depGraph
      .files()
      .map(([ns, file]) => [ns, compile(file, ns, config)])
      .forEach(([ns, file]) => {
        const filePath = utils.nameToPath(ns, config, true);
        loader.writeFile(filePath, file.compiled.code);
      });
  } catch (e) {
    console.log(e);
    process.exit();
  }
};

module.exports.irToJs = compile;
module.exports.dependency = dependency;
module.exports.fromNsToIr = fromNsToIr;
module.exports.compileToIr = compileToIr;
