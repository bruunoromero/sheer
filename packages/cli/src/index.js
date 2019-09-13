#!/usr/bin/env node

const program = require("commander")

const run = require("./run")
const test = require("./test")
const create = require("./create")
const compile = require("./compile")

program
  .command("compile")
  .alias("c")
  .action(compile)

program
  .command("run")
  .alias("r")
  .action(run)

program
  .command("test")
  .alias("t")
  .action(test)

program
  .command("create <project>")
  .alias("ct")
  .action(create)

program.parse(process.argv)

if (!program.args.length) program.help()
