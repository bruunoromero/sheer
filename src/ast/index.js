const types = require("./types");

const withLocation = (start, end, node) => {
  node.loc = { start, end };
  return node;
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

module.exports.nilLiteral = ({ start, end, value }) => {
  return withLocation(start, end, {
    type: types.NIL
  });
};

module.exports.boolLiteral = ({ start, end, value }) => {
  return withLocation(start, end, {
    value: Boolean(value),
    type: types.BOOL
  });
};
