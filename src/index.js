const { program } = require('commander');
const chalk = require('chalk');
const gradient = require('gradient-string');
const commands = require('./commands');
const packageJson = require('../package.json');
const chain = require('./commands/chain');
const interactive = require('./commands/interactive');
const { successMsg, errorMsg } = require('./utils/ui');
const checkForUpdates = require('./version-check');


(async () => {
  try {
    await checkForUpdates();
  } catch (err) {
    // Silently fail
  }
})();
let boxen;
import('boxen').then(({ default: boxenModule }) => {
  boxen = boxenModule;
}).catch(err => {
  console.error('Failed to load boxen:', err);
  process.exit(1);
});

process.title = 'command-shortner';

process.on('uncaughtException', (err) => {
  errorMsg(err.message);
  process.exit(1);
});

const getWelcomeMessage = () => {
  if (!boxen) return '';
  return boxen(
    gradient.pastel(`
    ⚡ ${chalk.bold('Command Shortner')} v${packageJson.version}
    ${chalk.italic('Save and run long commands with short aliases')}
  `), 
    { padding: 1, borderStyle: 'round', borderColor: 'cyan' }
  );
};

program
  .version(getWelcomeMessage() || packageJson.version)
  .description('CLI Command Shortner - Save and run long commands with short aliases');

program
  .command('add <alias> <command>')
  .description('Add a new command alias')
  .action((alias, cmd) => {
    try {
      commands.addCommand(alias, cmd);
      successMsg(`Alias "${alias}" added successfully!`);
    } catch (error) {
      errorMsg(error.message);
    }
  });

program
  .command('remove <alias>')
  .description('Remove a command alias')
  .action((alias) => {
    try {
      commands.removeCommand(alias);
      successMsg(`Alias "${alias}" removed successfully!`);
    } catch (error) {
      errorMsg(error.message);
    }
  });

program
  .command('list')
  .description('List all command aliases')
  .action(() => {
    try {
      const cmdList = commands.listCommands();
      if (cmdList.isEmpty) {
        console.log(chalk.yellow('No commands saved yet.'));
        return;
      }
      require('./utils/ui').showCommandTable(cmdList);
    } catch (error) {
      errorMsg(error.message);
    }
  });

program
  .command('run <alias>')
  .description('Run a command by its alias')
  .option('-s, --silent', 'Run silently without showing command being executed')
  .action(async (alias, options) => {
    try {
      await commands.runCommand(alias, options.silent);
    } catch (error) {
      errorMsg(error.message);
    }
  });
/*

// deprecated command -- follow chain-alias
program
  .command('chain <commands>')
  .description('--deprecated command is obsolete and should be avoided; use chain-alias instead.')
  .option('-s, --silent', 'Run silently without showing commands being executed')
  .action(async (commands, options) => {
    try {
      await chain.runChain(commands, options.silent);
    } catch (error) {
      errorMsg(error.message);
    }
  });
 */
program
  .command('chain-alias <aliases>')
  .description('Run multiple aliases sequentially (comma-separated)')
  .option('-s, --silent', 'Run silently without showing commands being executed')
  .action(async (aliases, options) => {
    try {
      await chain.runChainAlias(aliases, options.silent);
    } catch (error) {
      errorMsg(error.message);
    }
  });

program
  .command('export [file]')
  .description('Export all commands to a JSON file (default: ./boost-commands.json)')
  .action((file) => {
    try {
      const exportPath = commands.exportCommands(file);
      successMsg(`Commands exported successfully to: ${exportPath}`);
    } catch (error) {
      errorMsg(error.message);
    }
  });

program
  .command('import <file>')
  .description('Import commands from a JSON file')
  .action((file) => {
    try {
      const count = commands.importCommands(file);
      successMsg(`Successfully imported ${count} commands`);
    } catch (error) {
      errorMsg(error.message);
    }
  });

program
  .command('interactive')
  .description('Launch interactive mode')
  .action(() => {
    try {
      interactive.start();
    } catch (error) {
      errorMsg(error.message);
    }
  });

program
  .command('fix-windows')
  .description('Generate a batch file to make boost work in PowerShell')
  .action(() => {
    try {
      const batchPath = commands.generateWindowsFix();
      successMsg(`Windows fix created successfully at: ${batchPath}`);
      console.log(chalk.blue('\nCopy this file to a directory in your PATH or add its location to your PATH variable.'));
    } catch (error) {
      errorMsg(error.message);
    }
  });

  program
    .command('check-updates')
    .description('Manually check for available updates')
    .action(async () => {
      try {
        await checkForUpdates(true); 
        successMsg('Update check completed');
      } catch (error) {
        errorMsg('Failed to check for updates: ' + error.message);
      }
    });

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}