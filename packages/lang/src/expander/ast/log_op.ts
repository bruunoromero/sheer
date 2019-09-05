import { ExNode } from "./node";
import { Location } from "../../parser/ast";
import { ExType } from "../types";

export class ExLogOpNode extends ExNode {
  constructor(
    loc: Location,
    public readonly left: ExNode,
    public readonly right: ExNode,
    public readonly op: string
  ) {
    super(loc, ExType.LOG_OP);
  }
}
