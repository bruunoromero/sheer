#!/usr/bin/env node

const program = require("commander");
const compiler = require("@cris/lang");

const run = require("./run");
const create = require("./create");

program
  .command("compile")
  .alias("c")
  .action(compiler);

program
  .command("run")
  .alias("r")
  .action(run);

program
  .command("create <project>")
  .alias("ct")
  .action(create);

program.parse(process.argv);

if (!program.args.length) program.help();
