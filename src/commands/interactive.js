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

  
  let orderedAliases = [...aliases];
  
  if (aliases.length > 1) {
    const { confirmOrder } = await inquirer.prompt({
      type: 'confirm',
      name: 'confirmOrder',
      message: 'Would you like to reorder the commands?',
      default: false
    });
    
    if (confirmOrder) {
      const { newOrder } = await inquirer.prompt({
        type: 'list',
        name: 'newOrder',
        message: 'Select order type:',
        choices: [
          { name: 'Keep current order', value: 'keep' },
          { name: 'Reverse order', value: 'reverse' },
          { name: 'Manual reordering', value: 'manual' }
        ]
      });
      
      if (newOrder === 'reverse') {
        orderedAliases = orderedAliases.reverse();
      } 
      else if (newOrder === 'manual') {
    
        console.log(chalk.cyan('\nReorder commands by selecting them one by one:'));
        const reordered = [];
        const remaining = [...orderedAliases];
        
        while (remaining.length > 0) {
          const { nextCmd } = await inquirer.prompt({
            type: 'list',
            name: 'nextCmd',
            message: `Select command #${reordered.length + 1}:`,
            choices: remaining.map(a => ({
              name: `${chalk.cyan(a)}: ${cmdList[a]}`,
              value: a
            }))
          });
          
          reordered.push(nextCmd);
          const index = remaining.indexOf(nextCmd);
          remaining.splice(index, 1);
        }
        
        orderedAliases = reordered;
      }
    }
  }


  console.log(chalk.cyan('\nCommand execution order:'));
  orderedAliases.forEach((alias, index) => {
    console.log(`${index + 1}. ${chalk.cyan(alias)}: ${cmdList[alias]}`);
  });

  const { confirm } = await inquirer.prompt({
    type: 'confirm',
    name: 'confirm',
    message: 'Run these commands in sequence?',
    default: true
  });

  if (!confirm) {
    console.log(chalk.yellow('\nCommand chain cancelled.\n'));
    return;
  }

  try {
   
    await chain.runChainAlias(orderedAliases.join(' '));
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