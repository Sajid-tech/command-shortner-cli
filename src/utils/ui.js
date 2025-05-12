const chalk = require('chalk');
const Table = require('cli-table3');

const successMsg = (message) => {
  console.log(chalk.green.bold('✓ ') + chalk.green(message));
};

const errorMsg = (message) => {
  console.log(chalk.red.bold('✗ ') + chalk.red(message));
};

const showCommandTable = (commands) => {
  const table = new Table({
    head: [chalk.cyan.bold('Alias'), chalk.cyan.bold('Command')],
    colWidths: [20, 60],
    style: {
      head: ['cyan'],
      border: ['gray']
    }
  });

  Object.entries(commands).forEach(([alias, cmd]) => {
    table.push([chalk.yellow(alias), cmd]);
  });

  console.log(table.toString());
};

const fancyTable = (data) => {
  const table = new Table({
    style: {
      head: ['cyan'],
      border: ['gray']
    }
  });

  data.forEach(row => table.push(row));
  return table.toString();
};

module.exports = {
  successMsg,
  errorMsg,
  showCommandTable,
  fancyTable
};