#!/usr/bin/env node

const { program } = require('commander');
const chalk = require('chalk');
const inquirer = require('inquirer');
const config = require('./config');
const commands = require('./commands');

program
  .version('1.0.0')
  .description('CLI Command Shortner - Save and run long commands with short aliases');

program
  .command('add <alias> <command>')
  .description('Add a new command alias')
  .action((alias, cmd) => {
    commands.addCommand(alias, cmd);
    console.log(chalk.green(`Alias "${alias}" added successfully!`));
  });

program
  .command('remove <alias>')
  .description('Remove a command alias')
  .action((alias) => {
    commands.removeCommand(alias);
    console.log(chalk.green(`Alias "${alias}" removed successfully!`));
  });

program
  .command('list')
  .description('List all command aliases')
  .action(() => {
    commands.listCommands();
  });

program
  .command('run <alias>')
  .description('Run a command by its alias')
  .action((alias) => {
    commands.runCommand(alias);
  });

program.parse(process.argv);

// If no commands are provided, show help
if (!process.argv.slice(2).length) {
  program.outputHelp();
}