import { ParserType } from "./types";
import * as utils from "../utils";

const withLocation = (start, end, node) => {
  node.loc = { start, end };
  return node;
};

export const list = ({ start, end, value }) => {
  return withLocation(start, end, {
    value: value,
    type: ParserType.LIST
  });
};

export const vector = ({ start, end, value }) => {
  return withLocation(start, end, {
    value: value,
    type: ParserType.VECTOR
  });
};

export const set = ({ start, end, value }) => {
  return withLocation(start, end, {
    value: value,
    type: ParserType.SET
  });
};

export const map = ({ start, end, value }) => {
  return withLocation(start, end, {
    type: ParserType.MAP,
    value: utils.chunks(value, 2)
  });
};

export const stringLiteral = ({ start, end, value }) => {
  return withLocation(start, end, {
    value: value,
    type: ParserType.STRING
  });
};

export const symbol = ({ start, end, value }) => {
  return withLocation(start, end, {
    value: value,
    type: ParserType.SYMBOL
  });
};

export const keyword = ({ start, end, value }) => {
  return withLocation(start, end, {
    value: value,
    type: ParserType.KEYWORD
  });
};

export const numberLiteral = ({ start, end, value }) => {
  return withLocation(start, end, {
    value: Number(value),
    type: ParserType.NUMBER
  });
};

export const nullLiteral = ({ start, end, value }) => {
  return withLocation(start, end, {
    type: ParserType.NULL
  });
};

export const boolLiteral = ({ start, end, value }) => {
  return withLocation(start, end, {
    type: ParserType.BOOL,
    value: value === "true"
  });
};
