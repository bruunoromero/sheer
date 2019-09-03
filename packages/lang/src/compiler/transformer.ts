import * as path from "path";
import * as babel from "@babel/types";

import * as utils from "../utils";

export const statement = node => {
  if (
    node.type.toLowerCase().indexOf("expression") > -1 ||
    node.type.toLowerCase().indexOf("literal") > -1
  ) {
    return babel.expressionStatement(node);
  }

  return node;
};

const returnLast = (curr, index, exprs) => {
  if (index === exprs.length - 1) {
    return babel.returnStatement(curr);
  }

  return curr;
};

const toRestIfNeeded = (node, params) => {
  if (node.rest) {
    const init = params.slice(0, -2);
    const rest = babel.restElement(params.slice(-1)[0]);

    return init.concat([rest]);
  }

  return params;
};

export const number = node => {
  return babel.numericLiteral(node.value);
};

export const bool = node => {
  return babel.booleanLiteral(node.value);
};

export const string = node => {
  return babel.stringLiteral(node.value);
};

export const declare = (node, traverse) => {
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
};

export const member = (node, traverse) => {
  const member = traverse(node.member);
  const callee = traverse(node.owner);

  return babel.memberExpression(callee, member, !babel.isIdentifier(member));
};

export const def = (node, traverse) => {
  return babel.assignmentExpression(
    "=",
    babel.memberExpression(
      babel.identifier(utils.GLOBALS),
      babel.stringLiteral(node.name),
      true
    ),
    traverse(node.value)
  );
};

export const symbol = node => {
  return babel.identifier(utils.normalizeName(node.value));
};

export const if_ = (node, traverse) => {
  return babel.conditionalExpression(
    traverse(node.cond),
    traverse(node.truthy),
    traverse(node.falsy)
  );
};

export const null_ = () => {
  return babel.nullLiteral();
};

export const logOp = (node, traverse) => {
  return babel.logicalExpression(
    node.op,
    traverse(node.left),
    traverse(node.right)
  );
};

export const binOp = (node, traverse) => {
  return babel.binaryExpression(
    node.op,
    traverse(node.left),
    traverse(node.right)
  );
};

export const not = (node, traverse) => {
  return babel.unaryExpression("!", traverse(node.value));
};

export const fn = (node, traverse) => {
  const params = node.params.map(traverse);
  const expandedParams = toRestIfNeeded(node, params);
  return babel.callExpression(
    babel.memberExpression(
      babel.identifier(utils.CORE),
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
};

export const fnCall = (node, traverse) => {
  return babel.callExpression(traverse(node.callee), node.args.map(traverse));
};

export const require_ = (node, traverse, config) => {
  const currentPath = utils.nameToPath(config.ns, config, true);
  const filePath = utils.nameToPath(node.ns.value, config, true);
  const resolvedPath = path.relative(currentPath, filePath).slice(1);

  if (!resolvedPath) return;

  const name = traverse(node.ns, config);
  const as = node.as ? traverse(node.as, config) : null;
  return babel.importDeclaration(
    [babel.importDefaultSpecifier(as || name)],
    babel.stringLiteral(resolvedPath)
  );
};

export const import_ = (node, traverse, config) => {
  return babel.importDeclaration(
    [
      babel.importDefaultSpecifier(
        babel.identifier(utils.normalizeName(node.as.value))
      )
    ],
    babel.stringLiteral(node.path.value)
  );
};

export const vector = (node, traverse) => {
  return babel.arrayExpression(node.value.map(traverse));
};
