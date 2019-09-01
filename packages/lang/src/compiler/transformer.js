const babel = require("@babel/types");

const utils = require("../utils");

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

module.exports.number = node => {
  return babel.numericLiteral(node.value);
};

module.exports.string = node => {
  return babel.stringLiteral(node.value);
};

module.exports.declare = (node, traverse) => {
  if (node.isGlobal) {
    return babel.assignmentExpression(
      "=",
      babel.memberExpression(
        babel.identifier(utils.normalizeName(utils.GLOBALS)),
        babel.stringLiteral(utils.normalizeName(node.value)),
        true
      ),
      traverse(node.init)
    );
  }

  //TODO: Do something when is not global
  return null;
};

module.exports.member = node => {
  return babel.memberExpression(
    babel.identifier(node.owner),
    babel.stringLiteral(node.member),
    true
  );
};

module.exports.def = (node, traverse) => {
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

module.exports.and = (node, traverse) => {
  return babel.logicalExpression(
    "&&",
    traverse(node.left),
    traverse(node.right)
  );
};

module.exports.eq = (node, traverse) => {
  return babel.binaryExpression(
    "===",
    traverse(node.left),
    traverse(node.right)
  );
};

module.exports.notEq = (node, traverse) => {
  return babel.binaryExpression(
    "!==",
    traverse(node.left),
    traverse(node.right)
  );
};

module.exports.not = (node, traverse) => {
  return babel.unaryExpression("!", traverse(node.value));
};

module.exports.fn = (node, traverse) => {
  return babel.functionExpression(
    null,
    node.params.map(traverse),
    babel.blockStatement(
      node.body
        .map(traverse)
        .map(returnLast)
        .map(statement)
    )
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
  const filePath = utils.nameToPath(node.ns.value, config);
  const name = traverse(node.ns, config);
  const as = node.as ? traverse(node.as, config) : null;

  return babel.importDeclaration(
    [babel.importDefaultSpecifier(as || name)],
    babel.stringLiteral(filePath)
  );
};

module.exports.vector = (node, traverse) => {
  return babel.arrayExpression(node.value.map(traverse));
};

module.exports.statement = statement;
