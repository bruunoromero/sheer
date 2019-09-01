const types = require("./types");
const utils = require("../utils");

const withLocation = (start, end, node) => {
  node.loc = { start, end };
  return node;
};

module.exports.list = ({ start, end, value }) => {
  return withLocation(start, end, {
    value: value,
    type: types.LIST
  });
};

module.exports.vector = ({ start, end, value }) => {
  return withLocation(start, end, {
    value: value,
    type: types.VECTOR
  });
};

module.exports.set = ({ start, end, value }) => {
  return withLocation(start, end, {
    value: value,
    type: types.SET
  });
};

module.exports.map = ({ start, end, value }) => {
  return withLocation(start, end, {
    type: types.MAP,
    value: utils.chunks(value, 2)
  });
};

module.exports.stringLiteral = ({ start, end, value }) => {
  return withLocation(start, end, {
    value: value,
    type: types.STRING
  });
};

module.exports.symbol = ({ start, end, value }) => {
  return withLocation(start, end, {
    value: value,
    type: types.SYMBOL
  });
};

module.exports.keyword = ({ start, end, value }) => {
  return withLocation(start, end, {
    value: value,
    type: types.KEYWORD
  });
};

module.exports.numberLiteral = ({ start, end, value }) => {
  return withLocation(start, end, {
    value: Number(value),
    type: types.NUMBER
  });
};

module.exports.nullLiteral = ({ start, end, value }) => {
  return withLocation(start, end, {
    type: types.NULL
  });
};

module.exports.boolLiteral = ({ start, end, value }) => {
  return withLocation(start, end, {
    type: types.BOOL,
    value: value === "true"
  });
};

module.exports.withLocation = withLocation;
