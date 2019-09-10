import { language } from "./language";

import { ParserConcreteNode } from "./ast";

export const transform = (source: string): ParserConcreteNode[] => {
  try {
    return language.File.tryParse(source);
  } catch (e) {
    throw e.message;
  }
};
