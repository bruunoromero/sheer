import { ExDefNode } from "../../expander/ast/def";
import { ExImportNode } from "../../expander/ast/import";
import { ExNamespaceNode } from "../../expander/ast/namespace";
import { ExNode } from "../../expander/ast/node";
import {
  ExBoolNode,
  ExNullNode,
  ExNumberNode,
  ExStringNode,
  ExSymbolNode,
  ExKeywordNode,
  ExVectorNode,
  ExMapNode
} from "../../expander/ast/primitives";
import { ExRequireNode } from "../../expander/ast/require";
import { ExType } from "../../expander/types";
import {
  IrBoolNode,
  IrNullNode,
  IrNumberNode,
  IrStringNode,
  IrSymbolNode
} from "../ast/primitives";
import { IrContext } from "../contex";
import { AIrTraverser } from "./atraverser";
import { IrDefTraverser } from "./def";
import { IrImportTraverser } from "./import";
import { IrNamespaceTraverser } from "./namespace";
import { IrRequireTraverser } from "./require";
import { IrFnTraverser } from "./fn";
import { ExFnNode } from "../../expander/ast/fn";
import { IrFnCallTraverser } from "./fn_call";
import { ExFnCallNode } from "../../expander/ast/fn_call";
import { IrIfTraverser } from "./if";
import { ExIfNode } from "../../expander/ast/if";
import { IrLogOpTraverser } from "./log_op";
import { ExLogOpNode } from "../../expander/ast/log_op";
import { IrVectorTraverser } from "./vector";
import { IrNativeCallTraverse } from "./native_call";
import { ExNativeCallNode } from "../../expander/ast/native_call";
import { ExMemberNode } from "../../expander/ast/member";
import { IrMemberTraverser } from "./member";
import { IrMapTraverser } from "./map";

export class IrTraverser extends AIrTraverser<ExNode> {
  traverse(ctx: IrContext, node: ExNode) {
    switch (node.type) {
      case ExType.STRING:
      case ExType.KEYWORD:
        return new IrStringNode(node as
          | ExStringNode
          | ExKeywordNode).toExpression();
      case ExType.BOOL:
        return new IrBoolNode(node as ExBoolNode).toExpression();
      case ExType.NULL:
        return new IrNullNode(node as ExNullNode).toExpression();
      case ExType.NUMBER:
        return new IrNumberNode(node as ExNumberNode).toExpression();
      case ExType.SYMBOL:
        return new IrSymbolNode(node as ExSymbolNode).toExpression();
      case ExType.VECTOR:
        return new IrVectorTraverser(this.validator, this)
          .traverseAndValidate(ctx, node as ExVectorNode)
          .toExpression();
      case ExType.MAP:
        return new IrMapTraverser(this.validator, this)
          .traverseAndValidate(ctx, node as ExMapNode)
          .toExpression();
      case ExType.NS:
        return new IrNamespaceTraverser(
          this.validator,
          this
        ).traverseAndValidate(ctx, node as ExNamespaceNode);
      case ExType.IMPORT:
        return new IrImportTraverser(this.validator, this).traverseAndValidate(
          ctx,
          node as ExImportNode
        );
      case ExType.REQUIRE:
        return new IrRequireTraverser(this.validator, this).traverseAndValidate(
          ctx,
          node as ExRequireNode
        );
      case ExType.DEF:
        return new IrDefTraverser(this.validator, this)
          .traverseAndValidate(ctx, node as ExDefNode)
          .toExpression();
      case ExType.FN:
        return new IrFnTraverser(this.validator, this)
          .traverseAndValidate(ctx.extend(), node as ExFnNode)
          .toExpression();
      case ExType.FN_CALL:
        return new IrFnCallTraverser(this.validator, this)
          .traverseAndValidate(ctx, node as ExFnCallNode)
          .toExpression();
      case ExType.IF:
        return new IrIfTraverser(this.validator, this)
          .traverseAndValidate(ctx, node as ExIfNode)
          .toExpression();
      case ExType.LOG_OP:
        return new IrLogOpTraverser(this.validator, this)
          .traverseAndValidate(ctx, node as ExLogOpNode)
          .toExpression();
      case ExType.NATIVE_CALL:
        return new IrNativeCallTraverse(this.validator, this)
          .traverseAndValidate(ctx, node as ExNativeCallNode)
          .toExpression();
      case ExType.MEMBER:
        return new IrMemberTraverser(this.validator, this)
          .traverseAndValidate(ctx, node as ExMemberNode)
          .toExpression();
    }

    throw `cannot traverse type ${node.type} at ir`;
  }
}
