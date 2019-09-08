import { ParserType } from "./types";

export interface Position {
  line: number;
  offset?: number;
  column: number;
}

export interface Location {
  end: Position;
  start: Position;
}

export abstract class ParserNode<T> {
  constructor(
    public readonly loc: Location,
    public readonly value: T,
    public readonly type: ParserType
  ) {}
}

export type ParserConcreteNode =
  | ParserMap
  | ParserSet
  | ParserList
  | ParserBool
  | ParserNull
  | ParserString
  | ParserSymbol
  | ParserKeyword
  | ParserVector
  | ParserNumber;

export type ParserNodeValue =
  | string
  | number
  | boolean
  | ParserConcreteNode[]
  | ParserConcreteNode[][];

export class ParserString extends ParserNode<string> {
  constructor(location: Location, value: string) {
    super(location, value, ParserType.STRING);
  }
}

export class ParserSymbol extends ParserNode<string> {
  constructor(location: Location, value: string) {
    super(location, value, ParserType.SYMBOL);
  }
}

export class ParserKeyword extends ParserNode<string> {
  constructor(location: Location, value: string) {
    super(location, value, ParserType.KEYWORD);
  }
}

export class ParserSet extends ParserNode<ParserConcreteNode[]> {
  constructor(location: Location, value: ParserConcreteNode[]) {
    super(location, value, ParserType.SET);
  }
}

export class ParserList extends ParserNode<ParserConcreteNode[]> {
  constructor(location: Location, value: ParserConcreteNode[]) {
    super(location, value, ParserType.LIST);
  }
}

export class ParserMap extends ParserNode<ParserConcreteNode[][]> {
  constructor(location: Location, value: ParserConcreteNode[][]) {
    super(location, value, ParserType.MAP);
  }
}

export class ParserVector extends ParserNode<ParserConcreteNode[]> {
  constructor(location: Location, value: ParserConcreteNode[]) {
    super(location, value, ParserType.VECTOR);
  }
}

export class ParserBool extends ParserNode<boolean> {
  constructor(location: Location, value: boolean) {
    super(location, value, ParserType.BOOL);
  }
}

export class ParserNull extends ParserNode<null> {
  constructor(location: Location) {
    super(location, null, ParserType.NULL);
  }
}

export class ParserNumber extends ParserNode<number> {
  constructor(location: Location, value: number) {
    super(location, value, ParserType.NUMBER);
  }
}
