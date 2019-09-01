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

module.exports.buildList = buildList;
module.exports.buildString = buildString;
module.exports.buildNumber = buildNumber;
module.exports.buildSymbol = buildSymbol;
module.exports.buildVector = buildVector;
module.exports.buildKeyword = buildKeyword;
