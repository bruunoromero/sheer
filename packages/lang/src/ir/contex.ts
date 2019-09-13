import { ExNamespaceNode } from "../expander/ast/namespace";
import { IrDefNode } from "./ast/def";
import { IrRequireNode } from "./ast/require";
import { IrImportNode } from "./ast/import";
import { IrSymbolNode } from "./ast/primitives";
import { IrType } from "./types";

export class IrContext {
  _ns: ExNamespaceNode;
  _parent?: IrContext;
  _imports: { [name: string]: IrImportNode };
  _requires: { [name: string]: IrRequireNode };
  _definitions: { [name: string]: IrDefNode | IrSymbolNode };

  constructor(parent?: IrContext, ns?: ExNamespaceNode) {
    this._ns = ns;
    this._imports = {};
    this._requires = {};
    this._parent = parent;
    this._definitions = {};
  }

  get definitions() {
    return this._definitions;
  }

  collectRefers() {
    return Object.entries(this.root.requires).filter(
      ([name, req]) => req.refer
    );
  }

  collectPrivates(): string[] {
    return Object.entries(this.definitions)
      .filter(
        ([_, el]) => el.type === IrType.DEF && (el as IrDefNode).isPrivate
      )
      .map(([name]) => name);
  }

  collectExports(): [string, IrDefNode][] {
    return Object.entries(this.definitions).filter(
      ([_, el]) => el.type === IrType.DEF && !(el as IrDefNode).isPrivate
    ) as [string, IrDefNode][];
  }

  collectDependencies(): [string, IrRequireNode | IrImportNode][] {
    return Object.entries(this.requires)
      .filter(([name]) => this._ns && this._ns.name.value !== name)
      .concat(Object.entries(this.imports) as any);
  }

  get requires(): { [name: string]: IrRequireNode } {
    return this._requires;
  }

  get imports(): { [name: string]: IrImportNode } {
    return this._imports;
  }

  isRoot(): boolean {
    return this._parent ? false : true;
  }

  get root(): IrContext {
    if (this.isRoot()) {
      return this;
    }

    return this._parent.root;
  }

  hasLocalDefinition(name: string): boolean {
    return !!this._definitions[name];
  }

  findDefinition(name: string): [IrContext, IrDefNode | IrSymbolNode] {
    if (this.hasLocalDefinition(name)) {
      return [this, this._definitions[name]];
    }

    if (this.isRoot()) {
      return [null, null];
    }

    return this._parent.findDefinition(name);
  }

  hasLocalRequirement(name: string): boolean {
    return !!this._requires[name];
  }

  hasLocalImport(name: string): boolean {
    return !!this._imports[name];
  }

  addLocalDefinition(name: string, node: IrDefNode | IrSymbolNode) {
    this._definitions[name] = node;
  }

  addGlobalDefinition(name: string, node: IrDefNode) {
    this.root.addLocalDefinition(name, node);
  }

  addLocalImport(name: string, node: IrImportNode) {
    this._imports[name] = node;
  }

  addLocalRequirement(name: string, node: IrRequireNode) {
    this._requires[name] = node;
  }

  extend() {
    const ctx = new IrContext(this);

    return ctx;
  }
}
