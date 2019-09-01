"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var __$$CRIS_LANG_CORE$$__ = _interopRequireWildcard(require("@cris/lang/core"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj["default"] = obj; return newObj; } }

var __$$GLOBALS$$__ = {};
__$$GLOBALS$$__.curry = null;
__$$GLOBALS$$__["log!"] = null;
__$$GLOBALS$$__.map = null;
__$$GLOBALS$$__.filter = null;
__$$GLOBALS$$__.each = null;
__$$GLOBALS$$__["->"] = null;
__$$GLOBALS$$__.curry = __$$CRIS_LANG_CORE$$__["default"].curry;
__$$GLOBALS$$__["log!"] = __$$GLOBALS$$__.curry(console.log);
__$$GLOBALS$$__.map = __$$CRIS_LANG_CORE$$__.curry(function (f, coll) {
  return coll.map(f);
});
__$$GLOBALS$$__.filter = __$$CRIS_LANG_CORE$$__.curry(function (f, coll) {
  return coll.filter(f);
});
__$$GLOBALS$$__.each = __$$CRIS_LANG_CORE$$__.curry(function (f, coll) {
  return coll.forEach(f);
});
__$$GLOBALS$$__["->"] = __$$CRIS_LANG_CORE$$__.curry(function (x) {
  for (var _len = arguments.length, fns = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    fns[_key - 1] = arguments[_key];
  }

  return fns.reduce(__$$CRIS_LANG_CORE$$__.curry(function (v, f) {
    return f(v);
  }), x);
});

__$$GLOBALS$$__["->"]([1, 2, 3], __$$GLOBALS$$__.map(__$$CRIS_LANG_CORE$$__.curry(function (x) {
  return x + 2;
})), __$$GLOBALS$$__.filter(__$$CRIS_LANG_CORE$$__.curry(function (x) {
  return x !== 4;
})), __$$GLOBALS$$__.each(__$$CRIS_LANG_CORE$$__.curry(function (x) {
  return __$$GLOBALS$$__["log!"](x);
})));

var _default = __$$GLOBALS$$__;
exports["default"] = _default;
module.exports = exports.default;