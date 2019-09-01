#!/usr/bin/env node

const program = require("commander")
const compiler = require("@yall/lang")

const run = require("./run")
const test = require("./test")
const create = require("./create")

program
  .command("compile")
  .alias("c")
  .action(compiler)

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
