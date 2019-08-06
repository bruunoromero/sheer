const compiler = require("./compiler");
const bootstrap = require("./bootstrap");

bootstrap();

console.log(compiler.compile());
