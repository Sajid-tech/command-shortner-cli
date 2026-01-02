#!/usr/bin/env node
import { Command } from 'commander';
import gradient from 'gradient-string';
import boxen from 'boxen';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import { checkForUpdates } from './utils/VersionChecker.js';
import { errorMsg } from './utils/ui.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read package.json to get version
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
} catch (e) {
    // ignore
}

const program = new Command();

const getWelcomeMessage = () => {
    return boxen(
        gradient.pastel(`
    ⚡ Command Shortner v${packageVersion}
    Save and run long commands with short aliases
  `),
        { padding: 1, borderStyle: 'round', borderColor: 'cyan', dimBorder: true }
    );
};



program
    .name('boost')
    .version(packageVersion)
    .description('CLI Command Shortner - Professional Edition');

// Lazy Load Commands
program
    .command('add <alias> <command>')
    .description('Add a new command alias')
    .action(async (alias, cmd) => {
        const { registerAddCommand } = await import('./commands/AddCommand.js');
        // Since original architecture attached to program, we can't easily reuse 'register'.
        // But wait, the original registerAddCommand did: program.command(...).action(...)
        // We are already defining program.command here.
        // We just need the logic inside .action().

        // REFACTOR: We need to import the ConfigManager and logic directly here or refactor commands to export a handler.
        // For minimal impact refactor, I will copy the logic for now or genericize it.
        // Actually, cleaner is to refactor commands to export `handler` functions.

        // Let's assume we refactor AddCommand.
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

// Fallback for unknown commands (Fuzzy Search Support)
program.on('command:*', async (operands) => {
    const unknownCmd = operands[0];
    const { findBestMatch } = await import('./utils/FuzzyMatcher.js'); // We'll create this
    const { configManager } = await import('./core/ConfigManager.js');

    // Check if it's a valid alias for "run" (shortcut)
    // E.g. `boost myalias` -> `boost run myalias`
    const cmd = configManager.getCommand(unknownCmd);
    if (cmd) {
        const { commandExecutor } = await import('./core/CommandExecutor.js');
        // We need to handle this manually since we are outside 'run' command
        // Import run logic or just execute?
        // Let's execute to support shortcuts
        try {
            await commandExecutor.execute(cmd);
        } catch (e) {
            process.exit(1);
        }
        return;
    }

    // Fuzzy search for commands or aliases
    const errorMsg = (await import('./utils/ui.js')).errorMsg;
    const availableCommands = program.commands.map(cmd => cmd.name());
    const availableAliases = Object.keys(configManager.getCommands());

    // Suggest command
    const bestCmdMatch = findBestMatch(unknownCmd, availableCommands);
    if (bestCmdMatch) {
        errorMsg(`Invalid command: "${unknownCmd}". Did you mean "boost ${bestCmdMatch}"?`);
    } else {
        // Suggest alias
        const bestAliasMatch = findBestMatch(unknownCmd, availableAliases);
        if (bestAliasMatch) {
            errorMsg(`Unknown alias: "${unknownCmd}". Did you mean "boost run ${bestAliasMatch}"?`);
        } else {
            errorMsg(`Invalid command: ${program.args.join(' ')}\nSee --help for a list of available commands.`);
        }
    }
    process.exit(1);
});

(async () => {
    // Check for updates in background or at start? 
    // Plan: keep it at start but don't await blocking? 
    // Legacy awaited it. Let's keep it async but non-blocking if possible? 
    // Usually CLI tools check at END or very fast. 
    // We'll await it for now as per legacy but it is imported static currently.
    // We already imported checkForUpdates static at top.

    // Check for updates
    await checkForUpdates(packageVersion);

    if (!process.argv.slice(2).length) {
        console.log(getWelcomeMessage());
        program.outputHelp();
    }
    program.parse(process.argv);
})();
// Force IDE refresh
