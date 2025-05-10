#!/usr/bin/env node

const chalk = require('chalk');
const os = require('os');

console.log(chalk.blue('='.repeat(60)));
console.log(chalk.green.bold('  Command Shortner installed successfully!'));
console.log(chalk.blue('='.repeat(60)));

console.log(chalk.cyan('\nQuick Start:'));
console.log('  • Add a command:    ' + chalk.yellow('boost add <alias> "<command>"'));
console.log('  • Run a command:    ' + chalk.yellow('boost run <alias>'));
console.log('  • List commands:    ' + chalk.yellow('boost list'));
console.log('  • Remove command:   ' + chalk.yellow('boost remove <alias>'));

// only for  Windows-specific instructions
if (process.platform === 'win32') {
  console.log(chalk.blue('\nWindows Users:'));
  console.log('  If you encounter issues with PowerShell execution policy, run:');
  console.log('  ' + chalk.yellow('boost fix-windows'));
  console.log('  This will create a batch file that works in PowerShell and CMD.');
}

console.log(chalk.blue('\nEnjoy your productivity boost! 🚀'));