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

const toIrFromNs = (ns, depGraph, config) => {
  const path = utils.nameToPath(ns, config);
  return compileToIr(path, depGraph, config);
};

const loadFromDeps = (deps, depGraph, config) => {
  const toLoadDeps = deps
    .map(ns => toIrFromNs(ns, depGraph, config))
    .map(f => f.deps())
    .flat()
    .filter((v, i, arr) => arr.indexOf(v) === i)
    .filter(ns => !depGraph.files(ns));

  if (!toLoadDeps.length) return;

  loadFromDeps(toLoadDeps, depGraph, config);
};

module.exports = () => {
  const config = project.loadConfig();
  const depGraph = dependency(config);
  const entry = compileToIr(config.mainPath, depGraph, config);

  loadFromDeps(entry.deps(), depGraph, config);

  const files = depGraph
    .files()
    .map(([ns, file]) => [ns, compile(file, config)])
    .forEach(([ns, file]) => {
      const filePath = utils.nameToPath(ns, config, true);
      loader.writeFile(filePath, file.compiled.code);
    });
};

module.exports.irToJs = compile;
module.exports.dependency = dependency;
module.exports.toIrFromNs = toIrFromNs;
module.exports.compileToIr = compileToIr;
