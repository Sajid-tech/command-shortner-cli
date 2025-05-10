#!/usr/bin/env node

const { program } = require('commander');
const chalk = require('chalk');
const inquirer = require('inquirer');
const config = require('./config');
const commands = require('./commands');
const packageJson = require('../package.json');

// Set process title to make it easier to find in process list
process.title = 'command-shortner';

// Handle errors gracefully
process.on('uncaughtException', (err) => {
  console.error(chalk.red(`Error: ${err.message}`));
  process.exit(1);
});

program
  .version(packageJson.version)
  .description('CLI Command Shortner - Save and run long commands with short aliases');

program
  .command('add <alias> <command>')
  .description('Add a new command alias')
  .action((alias, cmd) => {
    try {
      commands.addCommand(alias, cmd);
      console.log(chalk.green(`Alias "${alias}" added successfully!`));
    } catch (error) {
      console.error(chalk.red(`Failed to add alias: ${error.message}`));
    }
  });

program
  .command('remove <alias>')
  .description('Remove a command alias')
  .action((alias) => {
    try {
      if (commands.removeCommand(alias)) {
        console.log(chalk.green(`Alias "${alias}" removed successfully!`));
      } else {
        console.log(chalk.yellow(`Alias "${alias}" not found.`));
      }
    } catch (error) {
      console.error(chalk.red(`Failed to remove alias: ${error.message}`));
    }
  });

program
  .command('list')
  .description('List all command aliases')
  .action(() => {
    try {
      commands.listCommands();
    } catch (error) {
      console.error(chalk.red(`Failed to list aliases: ${error.message}`));
    }
  });

program
  .command('run <alias>')
  .description('Run a command by its alias')
  .option('-s, --silent', 'Run silently without showing command being executed')
  .action((alias, options) => {
    try {
      commands.runCommand(alias, options.silent);
    } catch (error) {
      console.error(chalk.red(`Failed to run command: ${error.message}`));
    }
  });

// Special command for Windows PowerShell users
program
  .command('fix-windows')
  .description('Generate a batch file to make boost work in PowerShell')
  .action(() => {
    try {
      commands.generateWindowsFix();
    } catch (error) {
      console.error(chalk.red(`Failed to generate Windows fix: ${error.message}`));
    }
  });

program.parse(process.argv);

// If no commands are provided, show help
if (!process.argv.slice(2).length) {
  program.outputHelp();
}