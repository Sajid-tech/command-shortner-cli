import { Command } from 'commander';
import { configManager } from '../core/ConfigManager.js';
import { successMsg, errorMsg } from '../utils/ui.js';
import { z } from 'zod';

const AliasSchema = z.string().min(1).regex(/^[a-zA-Z0-9_-]+$/, 'Alias can only contain letters, numbers, underscores, and dashes');

export const addCommandAction = async (alias: string, command: string) => {
    try {
        const validation = AliasSchema.safeParse(alias);
        if (!validation.success) {
            throw new Error(validation.error.errors[0].message);
        }

        if (configManager.getCommand(alias)) {
            throw new Error(`Alias "${alias}" already exists`);
        }

        configManager.setCommand(alias, command);
        successMsg(`Alias "${alias}" added successfully!`);
    } catch (error) {
        errorMsg((error as Error).message);
    }
};

export function registerAddCommand(program: Command) {
    program
        .command('add <alias> <command>')
        .description('Add a new command alias')
        .action(addCommandAction);
}
