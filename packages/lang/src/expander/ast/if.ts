import { ExNode } from "./node";
import { Location } from "../../parser/ast";
import { ExType } from "../types";

export class ExIfNode extends ExNode {
  constructor(
    loc: Location,
    public readonly cond: ExNode,
    public readonly truthy: ExNode,
    public readonly falsy: ExNode
  ) {
    super(loc, ExType.IF);
  }
}
