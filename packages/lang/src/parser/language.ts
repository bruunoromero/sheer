import * as P from "parsimmon";
const t = require("./transformer");

export const language = P.createLanguage({
  Expression: r => {
    return P.alt(
      r.Keyword,
      r.String,
      r.Null,
      r.Bool,
      r.Number,
      r.Symbol,
      r.List,
      r.Vector,
      // r.Set,
      r.Map
    );
  },

  NotNewline: () => P.regexp(/[^\n]*/),
  _: r => r.Comment.sepBy(P.optWhitespace).trim(P.optWhitespace),
  Comment: r => r.NotNewline.wrap(P.string(";"), P.end),

  Symbol: () => {
    return P.regexp(
      /[a-zA-Z_\-\+=\.></\\\?\*\|$&!][a-zA-Z_\-\+=\.></\\\?\*\|$&!0-9]*/
    )
      .desc("a symbol")
      .mark()
      .map(t.symbol);
  },

  Keyword: r => {
    return P.seqObj<any>(P.string(":"), ["symbol", r.Symbol])
      .desc("a keyword")
      .mark()
      .map(({ start, end, value }) => ({
        start,
        end,
        value: value.symbol.value
      }))
      .map(t.keyword);
  },

  Number: () => {
    return P.regexp(/-?(0|[1-9][0-9]*)([.][0-9]+)?([eE][+-]?[0-9]+)?/)
      .desc("a number")
      .mark()
      .map(t.numberLiteral);
  },

  String: () => {
    return P.regexp(/"((?:\\.|.)*?)"/, 1)
      .desc("a string")
      .mark()
      .map(t.stringLiteral);
  },

  Null: () =>
    P.string("null")
      .desc("a null")
      .mark()
      .map(t.nullLiteral),

  Bool: () =>
    P.alt(P.string("true"), P.string("false"))
      .desc("a bool")
      .mark()
      .map(t.boolLiteral),

  List: r => {
    return r.Expression.trim(r._)
      .desc("a list")
      .many()
      .wrap(P.string("("), P.string(")"))
      .mark()
      .map(t.list);
  },

  Vector: r => {
    return r.Expression.trim(r._)
      .desc("a vector")
      .many()
      .wrap(P.string("["), P.string("]"))
      .mark()
      .map(t.vector);
  },

  Map: r => {
    return r.Expression.trim(r._)
      .desc("a map")
      .many()
      .wrap(P.string("{"), P.string("}"))
      .mark()
      .map(t.map);
  },

  Set: r => {
    return r.Expression.trim(r._)
      .many()
      .wrap(P.string("#{"), P.string("}"))
      .mark()
      .map(t.set);
  },

  File: function(r) {
    return r.Expression.trim(r._).many();
  }
});
