"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var __$$CRIS_CORE$$__ = _interopRequireWildcard(require("@cris/lang/core"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

var __$$GLOBALS$$__ = {};
__$$GLOBALS$$__["map"] = null;
__$$GLOBALS$$__["mapper"] = null;
__$$GLOBALS$$__["map"] = __$$CRIS_CORE$$__.curry(function (f, coll) {
  return coll["map"](f);
});
__$$GLOBALS$$__["mapper"] = __$$GLOBALS$$__["map"](__$$CRIS_CORE$$__.curry(function (x) {
  return x + 2;
}));
console["log"](__$$GLOBALS$$__["mapper"]([1, 2, 3]));
var _default = __$$GLOBALS$$__;
exports["default"] = _default;
module.exports = exports.default;