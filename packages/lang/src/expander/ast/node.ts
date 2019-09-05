import { ExType } from "../types";
import { Location } from "../../parser/ast";

export abstract class ExNode {
  constructor(public readonly loc: Location, public readonly type: ExType) {}
}
