const Language = require("./language");

module.exports = source => {
  return Language.File.tryParse(source);
};
