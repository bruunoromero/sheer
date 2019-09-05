import { ExNode } from "./node";
import { ExType } from "../types";
import { Location } from "../../parser/ast";

export class ExMemberNode extends ExNode {
  constructor(
    loc: Location,
    public readonly owner: ExNode,
    public readonly prop: ExNode
  ) {
    super(loc, ExType.MEMBER);
  }
}
