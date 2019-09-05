import { ExType } from "../types";
import { Location } from "../../parser/ast";

export abstract class ExNode {
  constructor(private readonly loc: Location, private readonly type: ExType) {}
}
