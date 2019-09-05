import { ExNode } from "./node";
import { Location } from "../../parser/ast";
import { ExType } from "../types";

export class ExFnNode extends ExNode {
  constructor(
    loc: Location,
    public readonly body: ExNode[],
    public readonly params: ExNode[],
    public readonly isRest: boolean
  ) {
    super(loc, ExType.FN);
  }
}
