const build = (type, value) => {
  return { loc: {}, type, value };
};

const buildSymbol = value => {
  return build("SYMBOL", value);
};

const buildString = value => {
  return build("STRING", value);
};

const buildNumber = value => {
  return build("NUMBER", value);
};

const buildVector = value => {
  return build("VECTOR", value);
};

const buildKeyword = value => {
  return build("KEYWORD", value);
};

const buildList = value => {
  return build("LIST", value);
};

const buildBool = value => {
  return build("BOOL", !!value);
};

module.exports.dummyNull = build("NULL");
module.exports.dummyList = buildList([]);
module.exports.dummyTrue = buildBool(true);
module.exports.dummyFalse = buildBool(false);
module.exports.dummyNumber = buildNumber(1);
module.exports.dummyVector = buildVector([]);
module.exports.dummySymbol = buildSymbol("a");
module.exports.dummyString = buildString("a");
module.exports.dummySymbolA = buildSymbol("a");
module.exports.dummySymbolB = buildSymbol("b");
module.exports.dummySymbolC = buildSymbol("c");
module.exports.dummyKeyword = buildKeyword("a");

module.exports.buildList = buildList;
module.exports.buildString = buildString;
module.exports.buildNumber = buildNumber;
module.exports.buildSymbol = buildSymbol;
module.exports.buildVector = buildVector;
module.exports.buildKeyword = buildKeyword;
