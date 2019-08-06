const parser = require("../parser");

module.exports.compile = () => {
  return parser.parse("(a 1 x true false nil -1 -0.1 :a)");
};
