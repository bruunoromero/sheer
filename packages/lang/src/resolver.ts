import { IrFile, IrMeta } from "./ir";
import { IrType } from "./ir/types";
import { IrSymbolNode, IrStringNode } from "./ir/ast/primitives";
import { IrDefNode } from "./ir/ast/def";
import { IrMemberNode } from "./ir/ast/member";
import { IrRequireNode } from "./ir/ast/require";

import * as utils from "./utils";
import { IrExpressionNode, IrNode } from "./ir/ast/node";
import { IrFnNode } from "./ir/ast/fn";
import { IrContext } from "./ir/contex";
import { IrIfNode } from "./ir/ast/if";
import { IrVectorNode } from "./ir/ast/vector";
import { IrFnCallNode } from "./ir/ast/fn_call";
import { IrNativeCallNode } from "./ir/ast/native_call";
import { IrLogOpNode } from "./ir/ast/log_op";
import { Validator } from "./validator";
import { IrMapNode } from "./ir/ast/map";

const resolveSymbol = (
  node: IrSymbolNode,
  validator: Validator,
  ctx: IrContext,
  metas: IrMeta[]
): IrMemberNode | IrSymbolNode => {
  const [foundCtx] = ctx.findDefinition(node.value);
  if (foundCtx) {
    if (foundCtx.isRoot()) {
      return new IrMemberNode(
        node.loc,
        IrSymbolNode.fromIrNode(node, utils.GLOBALS).toExpression(),
        IrStringNode.fromIrNode(node, node.value)
      );
    } else {
      return node;
    }
  }

  for (let [_, imp] of Object.entries(ctx.root.imports)) {
    if (
      imp.path.value === node.value ||
      (imp.as && imp.as.value === node.value)
    ) {
      return node;
    }
  }

  for (let [name, file] of ctx.collectRefers()) {
    if (Array.isArray(file.refer)) {
      for (let expNode of file.refer) {
        const expName = expNode.value as any;

        if (expName === node.value) {
          return new IrMemberNode(
            node.loc,
            file.ns.toExpression(),
            IrStringNode.fromIrNode(node, node.value)
          );
        }
      }
    } else if (file.refer.type === IrType.STRING) {
      if (file.refer.value !== "all") {
        // TODO: Error
      }

      const fileExports = metas.find(meta => meta.ns === name).exports;
      for (let expName of fileExports) {
        if (expName === node.value) {
          return new IrMemberNode(
            node.loc,
            file.ns.toExpression(),
            IrStringNode.fromIrNode(node, node.value)
          );
        }
      }
    }
  }

  validator.addError(
    node.loc,
    `could not find ${node.type.toLocaleLowerCase()} ${node.value}`
  );
  return node;
};

const resolveMember = (
  node: IrMemberNode,
  validator: Validator,
  ctx: IrContext,
  metas: IrMeta[]
) => {
  const owner = node.owner.value;
  const prop = (node.prop as IrExpressionNode).value;
  if (owner.type === IrType.SYMBOL) {
    for (let entry of ctx.collectDependencies()) {
      const [_, dep] = entry;

      if (
        dep.type === IrType.IMPORT &&
        dep.as &&
        (dep.as as IrSymbolNode).value === (owner as IrSymbolNode).value
      ) {
        return new IrMemberNode(
          node.loc,
          dep.as.toExpression(),
          IrStringNode.fromIrNode(prop, (prop as any).value)
        );
      }

      if (dep.type === IrType.REQUIRE) {
        if (
          ((dep as IrRequireNode).ns &&
            (dep as IrRequireNode).ns.value ===
              (owner as IrSymbolNode).value) ||
          (dep.as &&
            (dep as IrRequireNode).as.value === (owner as IrSymbolNode).value)
        ) {
          // TODO: validate that the file exports
          return new IrMemberNode(
            node.loc,
            (dep as IrRequireNode).ns.toExpression(),
            IrStringNode.fromIrNode(prop, (prop as any).value)
          );
        }
      }
    }
  }

  return new IrMemberNode(
    node.loc,
    resolveExpression(node.owner, validator, ctx, metas),
    IrStringNode.fromIrNode(prop, (prop as any).value)
  );
};

const resolveDef = (
  node: IrDefNode,
  validator: Validator,
  ctx: IrContext,
  metas: IrMeta[]
) => {
  return new IrDefNode(
    node.loc,
    node.name,
    resolveExpression(node.value, validator, ctx, metas),
    node.isPrivate
  );
};

const resolveFn = (
  node: IrFnNode,
  validator: Validator,
  ctx: IrContext,
  metas: IrMeta[]
) => {
  return new IrFnNode(
    node.loc,
    node.body.map(bNode =>
      resolveExpression(bNode as IrExpressionNode, validator, node.ctx, metas)
    ),
    node.params,
    node.isRest,
    node.ctx
  );
};

const resolveIf = (
  node: IrIfNode,
  validator: Validator,
  ctx: IrContext,
  metas: IrMeta[]
) => {
  return new IrIfNode(
    node.loc,
    resolveExpression(node.cond, validator, ctx, metas),
    resolveExpression(node.truthy, validator, ctx, metas),
    resolveExpression(node.falsy, validator, ctx, metas)
  );
};

const resolveVector = (
  node: IrVectorNode,
  validator: Validator,
  ctx: IrContext,
  metas: IrMeta[]
) => {
  return new IrVectorNode(
    node.loc,
    node.value.map(node => resolveExpression(node, validator, ctx, metas))
  );
};

const resolveMap = (
  node: IrMapNode,
  validator: Validator,
  ctx: IrContext,
  metas: IrMeta[]
) => {
  return new IrMapNode(
    node.loc,
    node.value.map(([key, value]) => [
      resolveExpression(key, validator, ctx, metas),
      resolveExpression(value, validator, ctx, metas)
    ])
  );
};

const resolveFnCall = (
  node: IrFnCallNode,
  validator: Validator,
  ctx: IrContext,
  metas: IrMeta[]
) => {
  return new IrFnCallNode(
    node.loc,
    resolveExpression(node.callee, validator, ctx, metas),
    node.args.map(node => resolveExpression(node, validator, ctx, metas))
  );
};

const resolveNativeCall = (
  node: IrNativeCallNode,
  validator: Validator,
  ctx: IrContext,
  metas: IrMeta[]
) => {
  return new IrNativeCallNode(
    node.loc,
    resolveExpression(node.callee, validator, ctx, metas),
    IrStringNode.fromIrNode(node, node.fn.value),
    node.args.map(node => resolveExpression(node, validator, ctx, metas))
  );
};

const resolveLogOp = (
  node: IrLogOpNode,
  validator: Validator,
  ctx: IrContext,
  metas: IrMeta[]
) => {
  return new IrLogOpNode(
    node.loc,
    resolveExpression(node.left, validator, ctx, metas),
    resolveExpression(node.right, validator, ctx, metas),
    node.op
  );
};

const wrapExpression = (
  fn: (
    node: IrNode,
    validator: Validator,
    ctx: IrContext,
    metas: IrMeta[]
  ) => IrNode
) => (
  node: IrNode,
  validator: Validator,
  ctx: IrContext,
  metas: IrMeta[]
): IrExpressionNode => {
  return fn(node, validator, ctx, metas).toExpression();
};

const resolveExpression = wrapExpression(
  (
    node: IrExpressionNode,
    validator: Validator,
    ctx: IrContext,
    metas: IrMeta[]
  ) => {
    switch (node.value.type) {
      case IrType.NULL:
      case IrType.BOOL:
      case IrType.STRING:
      case IrType.NUMBER:
        return node.value;
      case IrType.DEF:
        return resolveDef(node.value as IrDefNode, validator, ctx, metas);
      case IrType.FN:
        return resolveFn(node.value as IrFnNode, validator, ctx, metas);
      case IrType.IF:
        return resolveIf(node.value as IrIfNode, validator, ctx, metas);
      case IrType.VECTOR:
        return resolveVector(node.value as IrVectorNode, validator, ctx, metas);
      case IrType.MAP:
        return resolveMap(node.value as IrMapNode, validator, ctx, metas);
      case IrType.FN_CALL:
        return resolveFnCall(node.value as IrFnCallNode, validator, ctx, metas);
      case IrType.NATIVE_CALL:
        return resolveNativeCall(
          node.value as IrNativeCallNode,
          validator,
          ctx,
          metas
        );
      case IrType.LOG_OP:
        return resolveLogOp(node.value as IrLogOpNode, validator, ctx, metas);
      case IrType.SYMBOL:
        return resolveSymbol(node.value as IrSymbolNode, validator, ctx, metas);
      case IrType.MEMBER:
        return resolveMember(node.value as IrMemberNode, validator, ctx, metas);
    }
  }
);

const resolveFile = (file: IrFile, validator: Validator, metas: IrMeta[]) => {
  return file.program.map(node => {
    if (node.type === IrType.EXPRESSION) {
      return resolveExpression(
        node as IrExpressionNode,
        validator,
        file.ctx,
        metas
      );
    }

    return node;
  });
};

export const transform = (file: IrFile, metas: IrMeta[]): IrFile => {
  const validator = new Validator(file.source, file.path);
  const resolvedFile = new IrFile(
    file.ns,
    file.path,
    file.source,
    resolveFile(file, validator, metas),
    file.ctx
  );

  const errors = validator.errors;

  if (errors) {
    throw errors;
  }

  return resolvedFile;
};
