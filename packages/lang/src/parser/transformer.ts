import * as utils from "../utils";
import { ParserType } from "./types";

import {
  ParserSet,
  ParserMap,
  ParserBool,
  ParserNull,
  ParserList,
  ParserNumber,
  ParserVector,
  ParserString,
  ParserSymbol,
  ParserKeyword
} from "./ast";

export const list = ({ start, end, value }): ParserList => {
  return new ParserList({ start, end }, value);
};

export const vector = ({ start, end, value }) => {
  return new ParserVector({ start, end }, value);
};

export const set = ({ start, end, value }) => {
  return new ParserSet({ start, end }, value);
};

export const map = ({ start, end, value }) => {
  return new ParserMap({ start, end }, utils.chunks(value, 2));
};

export const stringLiteral = ({ start, end, value }) => {
  return new ParserString({ start, end }, value);
};

export const symbol = ({ start, end, value }) => {
  return new ParserSymbol({ start, end }, value);
};

export const keyword = ({ start, end, value }) => {
  return new ParserKeyword({ start, end }, value);
};

export const numberLiteral = ({ start, end, value }) => {
  return new ParserNumber({ start, end }, Number(value));
};

export const nullLiteral = ({ start, end }) => {
  return new ParserNull({ start, end });
};

export const boolLiteral = ({ start, end, value }) => {
  return new ParserBool({ start, end }, value === "true");
};
