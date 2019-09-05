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
  private _value: T;
  private _type: ParserType;
  private _loc: Location;

  constructor(location: Location, value: T, type: ParserType) {
    this._type = type;
    this._value = value;
    this._loc = location;
  }

  get type() {
    return this._type;
  }

  get value() {
    return this._value;
  }

  get loc() {
    return this._loc;
  }
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
