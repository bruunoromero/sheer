const P = require("parsimmon")
const t = require("./transformer")

module.exports = P.createLanguage({
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
      r.Map,
      r.Set
    )
  },

  Symbol: () => {
    return P.regexp(/[a-zA-Z_-][a-zA-Z0-9_-]*/)
      .mark()
      .map(t.symbol)
  },

  Keyword: r => {
    return P.seqObj(P.string(":"), ["symbol", r.Symbol])
      .mark()
      .map(({ start, end, value }) => ({
        start,
        end,
        value: value.symbol.value
      }))
      .map(t.keyword)
  },

  Number: () => {
    return P.regexp(/-?(0|[1-9][0-9]*)([.][0-9]+)?([eE][+-]?[0-9]+)?/)
      .mark()
      .map(t.numberLiteral)
  },

  String: () => {
    return P.regexp(/"((?:\\.|.)*?)"/, 1)
      .mark()
      .map(t.stringLiteral)
  },

  Null: () =>
    P.string("null")
      .mark()
      .map(t.nullLiteral),

  Bool: () =>
    P.alt(P.string("true"), P.string("false"))
      .mark()
      .map(t.boolLiteral),

  List: r => {
    return r.Expression.trim(P.optWhitespace)
      .many()
      .wrap(P.string("("), P.string(")"))
      .mark()
      .map(t.list)
  },

  Vector: r => {
    return r.Expression.trim(P.optWhitespace)
      .many()
      .wrap(P.string("["), P.string("]"))
      .mark()
      .map(t.vector)
  },

  Map: r => {
    return r.Expression.trim(P.optWhitespace)
      .many()
      .wrap(P.string("{"), P.string("}"))
      .mark()
      .map(t.map)
  },

  Set: r => {
    return r.Expression.trim(P.optWhitespace)
      .many()
      .wrap(P.string("#{"), P.string("}"))
      .mark()
      .map(t.map)
  },

  File: function(r) {
    return r.Expression.trim(P.optWhitespace).many()
  }
})
