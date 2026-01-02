#!/usr/bin/env node
import { Command } from 'commander';
import gradient from 'gradient-string';
import boxen from 'boxen';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import { checkForUpdates } from './utils/VersionChecker.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
let packageVersion = '0.0.0';
try {
    const possiblePaths = [
        path.resolve(__dirname, '..', 'package.json'),
        path.resolve(__dirname, '..', '..', 'package.json')
    ];
    for (const pkgPath of possiblePaths) {
        if (fs.existsSync(pkgPath)) {
            const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
            packageVersion = pkg.version;
            break;
        }
    }
}
catch (e) {
}
const program = new Command();
const getWelcomeMessage = () => {
    return boxen(gradient.pastel(`
    ⚡ Command Shortner v${packageVersion}
    Save and run long commands with short aliases
  `), { padding: 1, borderStyle: 'round', borderColor: 'cyan', dimBorder: true });
};
program
    .name('boost')
    .version(packageVersion)
    .description('CLI Command Shortner - Professional Edition');
program
    .command('add <alias> <command>')
    .description('Add a new command alias')
    .action(async (alias, cmd) => {
    const { registerAddCommand } = await import('./commands/AddCommand.js');
    const { addCommandAction } = await import('./commands/AddCommand.js');
    await addCommandAction(alias, cmd);
});
program
    .command('run <alias>')
    .description('Run a command by its alias')
    .option('-s, --silent', 'Run silently')
    .action(async (alias, options) => {
    const { runCommandAction } = await import('./commands/RunCommand.js');
    await runCommandAction(alias, options);
});
program
    .command('list')
    .description('List all command aliases')
    .action(async () => {
    const { listCommandAction } = await import('./commands/ListCommand.js');
    await listCommandAction();
});
program
    .command('remove <alias>')
    .description('Remove a command alias')
    .action(async (alias) => {
    const { removeCommandAction } = await import('./commands/RemoveCommand.js');
    await removeCommandAction(alias);
});
program
    .command('chain-alias <aliases>')
    .description('Run multiple aliases sequentially (comma-separated)')
    .option('-s, --silent', 'Run silently')
    .action(async (aliases, options) => {
    const { chainCommandAction } = await import('./commands/ChainCommand.js');
    await chainCommandAction(aliases, options);
});
program
    .command('interactive')
    .description('Launch interactive mode')
    .action(async () => {
    const { interactiveCommandAction } = await import('./commands/InteractiveCommand.js');
    await interactiveCommandAction();
});
program
    .command('fix-windows')
    .description('Generate a batch file to make boost work in PowerShell')
    .action(async () => {
    const { fixWindowsCommandAction } = await import('./commands/WindowsFixCommand.js');
    await fixWindowsCommandAction();
});
program
    .command('export [file]')
    .description('Export all commands to a JSON file (default: ./boost-commands.json)')
    .action(async (file) => {
    const { exportCommandAction } = await import('./commands/ExportCommand.js');
    await exportCommandAction(file);
});
program
    .command('import <file>')
    .description('Import commands from a JSON file')
    .action(async (file) => {
    const { importCommandAction } = await import('./commands/ImportCommand.js');
    await importCommandAction(file);
});
program
    .command('stats')
    .description('Show usage statistics for aliases')
    .action(async () => {
    const { statsCommandAction } = await import('./commands/StatsCommand.js');
    await statsCommandAction();
});
program.on('command:*', async (operands) => {
    const unknownCmd = operands[0];
    const { findBestMatch } = await import('./utils/FuzzyMatcher.js');
    const { configManager } = await import('./core/ConfigManager.js');
    const cmd = configManager.getCommand(unknownCmd);
    if (cmd) {
        const { commandExecutor } = await import('./core/CommandExecutor.js');
        try {
            await commandExecutor.execute(cmd);
        }
        catch (e) {
            process.exit(1);
        }
        return;
    }
    const errorMsg = (await import('./utils/ui.js')).errorMsg;
    const availableCommands = program.commands.map(cmd => cmd.name());
    const availableAliases = Object.keys(configManager.getCommands());
    const bestCmdMatch = findBestMatch(unknownCmd, availableCommands);
    if (bestCmdMatch) {
        errorMsg(`Invalid command: "${unknownCmd}". Did you mean "boost ${bestCmdMatch}"?`);
    }
    else {
        const bestAliasMatch = findBestMatch(unknownCmd, availableAliases);
        if (bestAliasMatch) {
            errorMsg(`Unknown alias: "${unknownCmd}". Did you mean "boost run ${bestAliasMatch}"?`);
        }
        else {
            errorMsg(`Invalid command: ${program.args.join(' ')}\nSee --help for a list of available commands.`);
        }
    }
    process.exit(1);
});
(async () => {
    await checkForUpdates(packageVersion);
    if (!process.argv.slice(2).length) {
        console.log(getWelcomeMessage());
        program.outputHelp();
    }
    program.parse(process.argv);
})();
//# sourceMappingURL=index.js.map