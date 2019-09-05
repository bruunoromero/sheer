import { language } from "./language";
// import { buildList, buildSymbol, buildKeyword, buildVector } from "./utils";

import { ParserConcreteNode } from "./ast";

// import * as utils from "../utils";
// import * as coreFns from "../../core/core_fns";

export const parse = (source: string): ParserConcreteNode[] => {
  return language.File.tryParse(source);
};
