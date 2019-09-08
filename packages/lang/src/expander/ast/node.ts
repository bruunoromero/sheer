import { ExType } from "../types";
import { Location } from "../../parser/ast";

export abstract class ExNode {
  constructor(public readonly loc: Location, public readonly type: ExType) {}
}

export class ExErrorNode extends ExNode {
  constructor() {
    super(
      { start: { column: 0, line: 0 }, end: { column: 0, line: 0 } },
      ExType.ERROR
    );
  }
}
