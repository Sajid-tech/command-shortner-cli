const chalk = require('chalk');
const inquirer = require('inquirer');
const commands = require('../commands');
const { showCommandTable } = require('../utils/ui');

const chain = require('../commands/chain');


const runCommand = async (cmdList) => {
  const { alias } = await inquirer.prompt({
    type: 'list',
    name: 'alias',
    message: 'Select command to run:',
    choices: Object.keys(cmdList).map(a => ({
      name: `${chalk.cyan(a)}: ${cmdList[a]}`,
      value: a
    }))
  });

  try {
    await commands.runCommand(alias);
  } catch (error) {
    console.log(chalk.red(`\nError: ${error.message}\n`));
  }
};

const addCommand = async () => {
  const { alias, command } = await inquirer.prompt([
    {
      type: 'input',
      name: 'alias',
      message: 'Enter alias name:',
      validate: input => input.trim() ? true : 'Alias cannot be empty'
    },
    {
      type: 'input',
      name: 'command',
      message: 'Enter command to save:',
      validate: input => input.trim() ? true : 'Command cannot be empty'
    }
  ]);

  try {
    commands.addCommand(alias, command);
    console.log(chalk.green(`\nAlias "${alias}" added successfully!\n`));
  } catch (error) {
    console.log(chalk.red(`\nError: ${error.message}\n`));
  }
};

const removeCommand = async (cmdList) => {
  const { alias } = await inquirer.prompt({
    type: 'list',
    name: 'alias',
    message: 'Select command to remove:',
    choices: Object.keys(cmdList).map(a => ({
      name: `${chalk.cyan(a)}: ${cmdList[a]}`,
      value: a
    }))
  });

  try {
    commands.removeCommand(alias);
    console.log(chalk.green(`\nAlias "${alias}" removed successfully!\n`));
  } catch (error) {
    console.log(chalk.red(`\nError: ${error.message}\n`));
  }
};


const chainCommands = async (cmdList) => {
  const { aliases } = await inquirer.prompt({
    type: 'checkbox',
    name: 'aliases',
    message: 'Select commands to chain (run sequentially):',
    choices: Object.keys(cmdList).map(a => ({
      name: `${chalk.cyan(a)}: ${cmdList[a]}`,
      value: a,
      checked: false
    }))
  });

  if (aliases.length === 0) {
    console.log(chalk.yellow('\nNo commands selected.\n'));
    return;
  }

  try {
   
    await chain.runChainAlias(aliases.join(','));
    console.log(chalk.green('\nAll commands executed successfully!\n'));
  } catch (error) {
    console.log(chalk.red(`\nError: ${error.message}\n`));
  }
};


const exportCommands = async () => {
  const { filePath } = await inquirer.prompt({
    type: 'input',
    name: 'filePath',
    message: 'Enter export file path (default: ./boost-commands.json):',
    default: './boost-commands.json'
  });

  try {
    const exportPath = commands.exportCommands(filePath);
    console.log(chalk.green(`\nCommands exported successfully to: ${exportPath}\n`));
  } catch (error) {
    console.log(chalk.red(`\nError: ${error.message}\n`));
  }
};

module.exports = {
  start: async () => {
    console.clear();
    console.log(chalk.cyan.bold('\n⚡ Command Shortner - Interactive Mode\n'));
    
    while (true) {
      const cmdList = commands.listCommands();
      const choices = [
        { name: 'List all commands', value: 'list' },
        { name: 'Run a command', value: 'run' },
        { name: 'Add new command', value: 'add' },
        { name: 'Remove command', value: 'remove' },
        { name: 'Chain commands', value: 'chain' },
        { name: 'Export commands', value: 'export' },
        new inquirer.Separator(),
        { name: 'Exit', value: 'exit' }
      ];

      const { action } = await inquirer.prompt({
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices
      });

      if (action === 'exit') break;

      switch (action) {
        case 'list':
          if (cmdList.isEmpty) {
            console.log(chalk.yellow('\nNo commands saved yet.\n'));
          } else {
            showCommandTable(cmdList);
          }
          break;

        case 'run':
          if (cmdList.isEmpty) {
            console.log(chalk.yellow('\nNo commands saved yet.\n'));
            break;
          }
          await runCommand(cmdList);
          break;

        case 'add':
          await addCommand();
          break;

        case 'remove':
          if (cmdList.isEmpty) {
            console.log(chalk.yellow('\nNo commands saved yet.\n'));
            break;
          }
          await removeCommand(cmdList);
          break;

        case 'chain':
          if (cmdList.isEmpty) {
            console.log(chalk.yellow('\nNo commands saved yet.\n'));
            break;
          }
          await chainCommands(cmdList);
          break;

        case 'export':
          await exportCommands();
          break;
      }
    }
  }
};