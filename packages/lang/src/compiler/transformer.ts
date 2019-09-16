import * as path from "path";
import * as babel from "@babel/types";

import * as utils from "../utils";
import { IrDefNode } from "../ir/ast/def";
import { IrSymbolNode } from "../ir/ast/primitives";
import { IrMapNode } from "../ir/ast/map";
import { Project } from "../project";
import { IrRequireNode } from "../ir/ast/require";
import { IrNode } from "../ir/ast/node";

const withLoc = fn => (node: IrNode, ...others) => {
  const n = fn(node, ...others);

  if (n) {
    n.loc = node.loc;
  }

  return n;
};

const collection = value => {
  return babel.callExpression(
    babel.memberExpression(
      babel.identifier(utils.RUNTIME),
      babel.identifier("fromJS")
    ),
    [value]
  );
};

export const statement = withLoc(node => {
  if (
    node.type.toLowerCase().indexOf("expression") > -1 ||
    node.type.toLowerCase().indexOf("literal") > -1 ||
    node.type.toLowerCase().indexOf("indentifier") > -1
  ) {
    return babel.expressionStatement(node);
  }

  return node;
});

const returnLast = (curr, index, exprs) => {
  if (index === exprs.length - 1) {
    return babel.returnStatement(curr);
  }

  return curr;
};

const toRestIfNeeded = (node, params) => {
  if (node.isRest) {
    const init = params.slice(0, -1);
    const rest = babel.restElement(params.slice(-1)[0]);

    return init.concat([rest]);
  }

  return params;
};

export const number = withLoc(node => {
  return babel.numericLiteral(node.value);
});

export const bool = withLoc(node => {
  return babel.booleanLiteral(node.value);
});

export const string = withLoc(node => {
  return babel.stringLiteral(node.value);
});

export const declare = withLoc((node, traverse) => {
  if (node.isGlobal) {
    return babel.assignmentExpression(
      "=",
      babel.memberExpression(
        babel.identifier(utils.normalizeName(utils.GLOBALS)),
        babel.stringLiteral(node.value),
        true
      ),
      traverse(node.init)
    );
  }

  //TODO: Do something when is not global
  return null;
});

export const member = withLoc((node, traverse) => {
  const member = traverse(node.prop);
  const callee = traverse(node.owner);

  return babel.memberExpression(callee, member, true);
});

export const def = withLoc((node: IrDefNode, traverse) => {
  return babel.assignmentExpression(
    "=",
    babel.memberExpression(
      babel.identifier(utils.GLOBALS),
      babel.stringLiteral(node.name.value),
      true
    ),
    traverse(node.value)
  );
});

export const symbol = withLoc((node: IrSymbolNode) => {
  return babel.identifier(utils.normalizeName(node.value));
});

export const if_ = withLoc((node, traverse) => {
  return babel.conditionalExpression(
    traverse(node.cond),
    traverse(node.truthy),
    traverse(node.falsy)
  );
});

export const null_ = () => {
  return babel.nullLiteral();
};

export const logOp = withLoc((node, traverse) => {
  return babel.logicalExpression(
    node.op,
    traverse(node.left),
    traverse(node.right)
  );
});

export const binOp = withLoc((node, traverse) => {
  return babel.binaryExpression(
    node.op,
    traverse(node.left),
    traverse(node.right)
  );
});

export const not = withLoc((node, traverse) => {
  return babel.unaryExpression("!", traverse(node.value));
});

export const fn = withLoc((node, traverse) => {
  const params = node.params.map(traverse);
  const expandedParams = toRestIfNeeded(node, params);
  return babel.callExpression(
    babel.memberExpression(
      babel.identifier(utils.RUNTIME),
      babel.identifier("curry")
    ),
    [
      babel.functionExpression(
        null,
        expandedParams,
        babel.blockStatement(
          node.body
            .map(traverse)
            .map(returnLast)
            .map(statement)
        )
      )
    ]
  );
});

export const fnCall = withLoc((node, traverse) => {
  return babel.callExpression(traverse(node.callee), node.args.map(traverse));
});

export const require_ = withLoc(
  (node: IrRequireNode, traverse, project: Project, opts) => {
    const dep = project.deps.find(
      ([config, metas]) =>
        metas.filter(meta => meta.ns === node.ns.value).length
    );

    const filePath = dep
      ? utils.nameToPath(node.ns.value, dep[0], true)
      : path
          .relative(
            utils.nameToPath(opts.ns, project.config, true),
            utils.nameToPath(node.ns.value, project.config, true)
          )
          .slice(1);

    if (!filePath) return;

    const name = traverse(node.ns, project);
    const as = node.as ? traverse(node.as, project) : null;
    return babel.importDeclaration(
      [babel.importDefaultSpecifier(as || name)],
      babel.stringLiteral(filePath)
    );
  }
);

export const nativeCall = withLoc((node, traverse) => {
  const member = babel.memberExpression(
    traverse(node.callee),
    traverse(node.fn),
    true
  );
  return babel.callExpression(member, node.args.map(traverse));
});

export const import_ = withLoc((node, traverse, config) => {
  return babel.importDeclaration(
    [
      babel.importDefaultSpecifier(
        babel.identifier(utils.normalizeName(node.as.value))
      )
    ],
    babel.stringLiteral(node.path.value)
  );
});

export const vector = withLoc((node, traverse) => {
  return collection(babel.arrayExpression(node.value.map(traverse)));
});

export const map = withLoc((node: IrMapNode, traverse) => {
  return collection(
    babel.objectExpression(
      node.value.map(([key, value]) =>
        babel.objectProperty(traverse(key), traverse(value), true)
      )
    )
  );
});
