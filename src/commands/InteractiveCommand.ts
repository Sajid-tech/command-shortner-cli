import { Command } from 'commander';
import inquirer from 'inquirer';
import { configManager } from '../core/ConfigManager.js';
import { commandExecutor } from '../core/CommandExecutor.js';
import { errorMsg, fancyTable, successMsg } from '../utils/ui.js';
import chalk from 'chalk';

export const interactiveCommandAction = async () => {
    try {
        await startInteractiveMode();
    } catch (error: any) {
        errorMsg(error.message);
    }
};

export function registerInteractiveCommand(program: Command) {
    program
        .command('interactive')
        .description('Launch interactive mode')
        .action(interactiveCommandAction);
}

async function startInteractiveMode() {
    console.log(chalk.bold.magenta('\n🚀 Command Shortner Interactive Mode'));

    while (true) {
        const { action } = await inquirer.prompt([
            {
                type: 'list',
                name: 'action',
                message: 'What would you like to do?',
                choices: [
                    { name: 'Run a command', value: 'run' },
                    { name: 'List all commands', value: 'list' },
                    { name: 'Add a new command', value: 'add' },
                    { name: 'Remove a command', value: 'remove' },
                    { name: 'Chain commands', value: 'chain' },
                    { name: 'Export commands', value: 'export' },
                    { name: 'Exit', value: 'exit' },
                ],
            },
        ]);

        if (action === 'exit') {
            console.log(chalk.cyan('Bye! 👋'));
            break;
        }

        if (action === 'chain') {
            const cmds = configManager.getCommands();
            if (Object.keys(cmds).length === 0) {
                console.log(chalk.yellow('No commands to chain.'));
                continue;
            }

            const { aliases } = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'aliases',
                    message: 'Enter aliases to chain (comma or space separated):'
                }
            ]);

            const aliasList = aliases.split(/[,\s]+/).map((a: string) => a.trim()).filter((a: string) => a);
            if (aliasList.length === 0) {
                console.log(chalk.yellow('No aliases provided.'));
                continue;
            }

            console.log(chalk.cyan(`\nRunning ${aliasList.length} commands in sequence...\n`));

            for (const alias of aliasList) {
                const cmd = configManager.getCommand(alias);
                if (!cmd) {
                    console.log(chalk.red(`Alias "${alias}" not found.`));
                } else {
                    console.log(chalk.yellow(`\n▶ Running [${alias}]: ${cmd}`));
                    try {
                        await commandExecutor.execute(cmd);
                    } catch (e) {
                        // Continue execution even if one fails? Legacy seemed to throw.
                        // But usually chains might want to stop? 
                        // Legacy `chain.js` threw the error, so let's log and maybe stop?
                        // "await commands.runRawCommand(cmd, silent);" -> executeCommand throws.
                        // So it stops.
                        errorMsg(`Failed to run ${alias}`);
                        break;
                    }
                }
            }
            successMsg('Chain execution finished.');
        }

        if (action === 'export') {
            const { filePath } = await inquirer.prompt([{
                type: 'input',
                name: 'filePath',
                message: 'Enter export path:',
                default: './boost-commands.json'
            }]);

            try {
                // Dynamically import fs/path to avoid top-level issues if any (though we differ to ESM)
                // Actually safer to just use standard imports if we had them or just re-import
                // We don't have fs imported. Let's rely on global error handling or add imports?
                // I'll add imports to the top of the file in a separate step or just assume they are available if I used them?
                // Wait, I didn't add fs imports to InteractiveCommand.ts yet. 
                // I will use a dirty "import()" for now or just add it to top of file in next step if this fails?
                // No, I can't add imports with replace_file_content easily without messing up lines.
                // I will add imports in a separate `multi_replace`.
                // Actually, I can allow `InteractiveCommand` to call `registerExportCommand` logic?
                // No, that's a command registration. 
                // Let's just use dynamic import for node modules here, it's clean for ESM.
                const fs = await import('fs');
                const path = await import('path');

                const cmds = configManager.getCommands();
                const resolvedPath = path.resolve(filePath);
                fs.writeFileSync(resolvedPath, JSON.stringify(cmds, null, 2));
                successMsg(`Exported to ${resolvedPath}`);
            } catch (e: any) {
                errorMsg(e.message);
            }
        }

        if (action === 'list') {
            const cmds = configManager.getCommands();
            fancyTable(cmds);
            continue;
        }

        if (action === 'run') {
            const cmds = configManager.getCommands();
            if (Object.keys(cmds).length === 0) {
                console.log(chalk.yellow('No commands to run.'));
                continue;
            }

            const { alias } = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'alias',
                    message: 'Select a command to run:',
                    choices: Object.entries(cmds).map(([alias, cmd]) => ({
                        name: `${alias} (${chalk.dim(cmd)})`,
                        value: alias
                    }))
                }
            ]);

            await commandExecutor.execute(cmds[alias]);
        }

        if (action === 'add') {
            const { alias, cmd } = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'alias',
                    message: 'Enter alias name:',
                    validate: (input) => input.trim() !== '' ? true : 'Alias cannot be empty'
                },
                {
                    type: 'input',
                    name: 'cmd',
                    message: 'Enter command:',
                    validate: (input) => input.trim() !== '' ? true : 'Command cannot be empty'
                }
            ]);

            try {
                if (configManager.getCommand(alias)) {
                    console.log(chalk.red(`Alias "${alias}" already exists.`));
                } else {
                    configManager.setCommand(alias, cmd);
                    successMsg('Command added!');
                }
            } catch (e: any) {
                errorMsg(e.message);
            }
        }

        if (action === 'remove') {
            const cmds = configManager.getCommands();
            if (Object.keys(cmds).length === 0) {
                console.log(chalk.yellow('No commands to remove.'));
                continue;
            }

            const { alias } = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'alias',
                    message: 'Select a command to remove:',
                    choices: Object.keys(cmds)
                }
            ]);

            try {
                configManager.removeCommand(alias);
                successMsg('Command removed!');
            } catch (e: any) {
                errorMsg(e.message);
            }
        }
    }
}
