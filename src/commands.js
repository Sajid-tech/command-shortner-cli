const chalk = require('chalk');
const { exec } = require('child_process');
const config = require('./config');

module.exports = {
  addCommand: (alias, command) => {
    const commands = config.get('commands') || {};
    commands[alias] = command;
    config.set('commands', commands);
  },

  removeCommand: (alias) => {
    const commands = config.get('commands') || {};
    if (commands[alias]) {
      delete commands[alias];
      config.set('commands', commands);
    }
  },

  listCommands: () => {
    const commands = config.get('commands') || {};
    if (Object.keys(commands).length === 0) {
      console.log(chalk.yellow('No commands saved yet.'));
      return;
    }

    console.log(chalk.blue.bold('\nSaved Command Aliases:\n'));
    Object.entries(commands).forEach(([alias, command]) => {
      console.log(chalk.cyan(`${alias}:`), command);
    });
  },

  runCommand: (alias) => {
    const commands = config.get('commands') || {};
    const command = commands[alias];

    if (!command) {
      console.log(chalk.red(`No command found for alias "${alias}"`));
      return;
    }

    console.log(chalk.yellow(`Running: ${command}\n`));
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.log(chalk.red(`Error: ${error.message}`));
        return;
      }
      if (stderr) {
        console.log(chalk.red(`Stderr: ${stderr}`));
        return;
      }
      console.log(chalk.green(stdout));
    });
  }
};