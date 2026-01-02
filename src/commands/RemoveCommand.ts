import { Command } from 'commander';
import { configManager } from '../core/ConfigManager.js';
import { successMsg, errorMsg } from '../utils/ui.js';

export const removeCommandAction = async (alias: string) => {
    try {
        configManager.removeCommand(alias);
        successMsg(`Alias "${alias}" removed successfully!`);
    } catch (error: any) {
        errorMsg(error.message);
    }
};

export function registerRemoveCommand(program: Command) {
    program
        .command('remove <alias>')
        .description('Remove a command alias')
        .action(removeCommandAction);
}
