const P = require("parsimmon");
const t = require("../ast");

module.exports = P.createLanguage({
  // An expression is just any of the other values we make in the language. Note
  // that because we're using `.createLanguage` here we can reference other
  // parsers off of the argument to our function. `r` is short for `rules` here.
  Expression: r => {
    return P.alt(
      r.Keyword,
      r.String,
      r.Nil,
      r.Bool,
      r.Number,
      r.Symbol,
      r.List,
      r.Vector,
      r.Map,
      r.Set
    );
  },

  // The basic parsers (usually the ones described via regexp) should have a
  // description for error message purposes.
  Symbol: () => {
    return P.regexp(/[a-zA-Z_-][a-zA-Z0-9_-]*/)
      .mark()
      .map(t.symbol);
  },

  Keyword: r => {
    return P.seqObj(P.string(":"), ["symbol", r.Symbol])
      .mark()
      .map(({ start, end, value }) => ({
        start,
        end,
        value: value.symbol.value
      }))
      .map(t.keyword);
  },

  // Note that Number("10") === 10, Number("9") === 9, etc in JavaScript.
  // This is not a recursive parser. Number(x) is similar to parseInt(x, 10).
  Number: () => {
    return P.regexp(/-?(0|[1-9][0-9]*)([.][0-9]+)?([eE][+-]?[0-9]+)?/)
      .mark()
      .map(t.numberLiteral);
  },

  String: () => {
    return P.regexp(/"((?:\\.|.)*?)"/, 1)
      .mark()
      .map(t.numberLiteral);
  },

  Nil: () =>
    P.string("nil")
      .mark()
      .map(t.nilLiteral),

  Bool: () =>
    P.alt(P.string("true"), P.string("false"))
      .mark()
      .map(t.boolLiteral),

  // `.trim(P.optWhitespace)` removes whitespace from both sides, then `.many()`
  // repeats the expression zero or more times. Finally, `.wrap(...)` removes
  // the '(' and ')' from both sides of the list.
  List: r => {
    return r.Expression.trim(P.optWhitespace)
      .many()
      .wrap(P.string("("), P.string(")"));
  },

  Vector: r => {
    return r.Expression.trim(P.optWhitespace)
      .many()
      .wrap(P.string("["), P.string("]"));
  },

  Map: r => {
    return r.Expression.trim(P.optWhitespace)
      .many()
      .wrap(P.string("{"), P.string("}"));
  },

  Set: r => {
    return r.Expression.trim(P.optWhitespace)
      .many()
      .wrap(P.string("#{"), P.string("}"));
  },

  // A file in Lisp is generally just zero or more expressions.
  File: function(r) {
    return r.Expression.trim(P.optWhitespace).many();
  }
});
