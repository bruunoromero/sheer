const Language = require("./language");
const {
  buildList,
  buildSymbol,
  buildKeyword,
  buildVector
} = require("./utils");

const utils = require("../utils");
const coreFns = require("../../core/core_fns");

const requireCore = buildList([
  buildSymbol("require"),
  buildVector([
    buildSymbol(`${utils.EXT}.core`),
    buildKeyword("refer"),
    buildVector(coreFns.map(buildSymbol))
  ])
]);

module.exports = source => {
  return [requireCore].concat(Language.File.tryParse(source));
};
