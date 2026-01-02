import inquirer from 'inquirer';
import { configManager } from '../core/ConfigManager.js';
import { commandExecutor } from '../core/CommandExecutor.js';
import { errorMsg, fancyTable, successMsg } from '../utils/ui.js';
import chalk from 'chalk';
export const interactiveCommandAction = async () => {
    try {
        await startInteractiveMode();
    }
    catch (error) {
        errorMsg(error.message);
    }
};
export function registerInteractiveCommand(program) {
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
            const aliasList = aliases.split(/[,\s]+/).map((a) => a.trim()).filter((a) => a);
            if (aliasList.length === 0) {
                console.log(chalk.yellow('No aliases provided.'));
                continue;
            }
            console.log(chalk.cyan(`\nRunning ${aliasList.length} commands in sequence...\n`));
            for (const alias of aliasList) {
                const cmd = configManager.getCommand(alias);
                if (!cmd) {
                    console.log(chalk.red(`Alias "${alias}" not found.`));
                }
                else {
                    console.log(chalk.yellow(`\n▶ Running [${alias}]: ${cmd}`));
                    try {
                        await commandExecutor.execute(cmd);
                    }
                    catch (e) {
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
                const fs = await import('fs');
                const path = await import('path');
                const cmds = configManager.getCommands();
                const resolvedPath = path.resolve(filePath);
                fs.writeFileSync(resolvedPath, JSON.stringify(cmds, null, 2));
                successMsg(`Exported to ${resolvedPath}`);
            }
            catch (e) {
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
                }
                else {
                    configManager.setCommand(alias, cmd);
                    successMsg('Command added!');
                }
            }
            catch (e) {
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
            }
            catch (e) {
                errorMsg(e.message);
            }
        }
    }
}
//# sourceMappingURL=InteractiveCommand.js.map