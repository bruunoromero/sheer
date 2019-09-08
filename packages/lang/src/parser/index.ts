import { language } from "./language";

import { ParserConcreteNode } from "./ast";

export const transform = (source: string): ParserConcreteNode[] => {
  return language.File.tryParse(source);
};
