export const build = (type: string, value: any): any => {
  return { loc: {}, type, value };
};

export const buildSymbol = (value: string) => {
  return build("SYMBOL", value);
};

export const buildString = (value: string) => {
  return build("STRING", value);
};

export const buildNumber = (value: number) => {
  return build("NUMBER", value);
};

export const buildVector = (value: any[]) => {
  return build("VECTOR", value);
};

export const buildKeyword = (value: string) => {
  return build("KEYWORD", value);
};

export const buildList = (value: any[]) => {
  return build("LIST", value);
};

export const buildBool = (value: boolean) => {
  return build("BOOL", value);
};
