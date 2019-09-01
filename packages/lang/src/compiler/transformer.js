const path = require("path");
const babel = require("@babel/types");

const utils = require("../utils");

const memberUtil = value => {
  const normalizedMember = utils.normalizeName(value);
  const isExpr = value !== normalizedMember;
  const member = isExpr ? babel.stringLiteral(value) : babel.identifier(value);

  return [isExpr, member];
};

const statement = node => {
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

module.exports.number = node => {
  return babel.numericLiteral(node.value);
};

module.exports.bool = node => {
  return babel.booleanLiteral(node.value);
};

module.exports.string = node => {
  return babel.stringLiteral(node.value);
};

module.exports.declare = (node, traverse) => {
  const [isExpr, member] = memberUtil(node.value);
  if (node.isGlobal) {
    return babel.assignmentExpression(
      "=",
      babel.memberExpression(
        babel.identifier(utils.normalizeName(utils.GLOBALS)),
        member,
        isExpr
      ),
      traverse(node.init)
    );
  }

  //TODO: Do something when is not global
  return null;
};

module.exports.member = node => {
  const normalizedMember = utils.normalizeName(node.member);
  const isExpr = node.member !== normalizedMember;
  const member = isExpr
    ? babel.stringLiteral(node.member)
    : babel.identifier(node.member);
  const callee = node.unnormalized
    ? node.owner
    : utils.normalizeName(node.owner);

  return babel.memberExpression(babel.identifier(callee), member, isExpr);
};

module.exports.def = (node, traverse) => {
  const [isExpr, member] = memberUtil(node.name);
  return babel.assignmentExpression(
    "=",
    babel.memberExpression(babel.identifier(utils.GLOBALS), member, isExpr),
    traverse(node.value)
  );
};

module.exports.symbol = node => {
  return babel.identifier(utils.normalizeName(node.value));
};

module.exports.if_ = (node, traverse) => {
  return babel.conditionalExpression(
    traverse(node.cond),
    traverse(node.truthy),
    traverse(node.falsy)
  );
};

module.exports.null_ = () => {
  return babel.nullLiteral();
};

module.exports.logOp = (node, traverse) => {
  return babel.logicalExpression(
    node.op,
    traverse(node.left),
    traverse(node.right)
  );
};

module.exports.binOp = (node, traverse) => {
  return babel.binaryExpression(
    node.op,
    traverse(node.left),
    traverse(node.right)
  );
};

module.exports.not = (node, traverse) => {
  return babel.unaryExpression("!", traverse(node.value));
};

module.exports.fn = (node, traverse) => {
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

module.exports.fnCall = (node, traverse) => {
  return babel.callExpression(traverse(node.callee), node.args.map(traverse));
};

module.exports.export = (node, traverse) => {
  return babel.exportNamedDeclaration(
    babel.variableDeclaration("const", [
      babel.variableDeclarator(
        babel.identifier(node.value),
        babel.memberExpression(
          babel.identifier(utils.GLOBALS),
          babel.stringLiteral(node.value),
          true
        )
      )
    ]),
    []
  );
};

module.exports.require_ = (node, traverse, config) => {
  const filePath = utils.nameToPath(node.ns.value, config, true);
  const currentPath = utils.nameToPath(config.ns, config, true);
  const resolvedPath = path.relative(currentPath, filePath).slice(1);
  
  if (!resolvedPath) return;

  const name = traverse(node.ns, config);
  const as = node.as ? traverse(node.as, config) : null;
  return babel.importDeclaration(
    [babel.importDefaultSpecifier(as || name)],
    babel.stringLiteral(resolvedPath)
  );
};

module.exports.import_ = (node, traverse, config) => {
  return babel.importDeclaration(
    [
      babel.importDefaultSpecifier(
        babel.identifier(utils.normalizeName(node.as.value))
      )
    ],
    babel.stringLiteral(node.path.value)
  );
};

module.exports.vector = (node, traverse) => {
  return babel.arrayExpression(node.value.map(traverse));
};

module.exports.statement = statement;
