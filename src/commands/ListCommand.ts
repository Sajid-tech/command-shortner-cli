import { Command } from 'commander';
import { configManager } from '../core/ConfigManager.js';
import { fancyTable, errorMsg } from '../utils/ui.js';
import chalk from 'chalk';

export const listCommandAction = async () => {
    try {
        const cmdList = configManager.getCommands();
        if (Object.keys(cmdList).length === 0) {
            console.log(chalk.yellow('No commands saved yet.'));
            return;
        }
        fancyTable(cmdList);
    } catch (error: any) {
        errorMsg(error.message);
    }
};

export function registerListCommand(program: Command) {
    program
        .command('list')
        .description('List all command aliases')
        .action(listCommandAction);
}
