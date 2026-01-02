import { Command } from 'commander';
import { configManager } from '../core/ConfigManager.js';
import { successMsg, errorMsg } from '../utils/ui.js';
import fs from 'fs';
import path from 'path';

export const importCommandAction = async (file: string) => {
    try {
        const filePath = path.resolve(file);
        if (!fs.existsSync(filePath)) {
            throw new Error(`File not found: ${filePath}`);
        }

        const data = fs.readFileSync(filePath, 'utf8');
        const commands = JSON.parse(data);

        let count = 0;
        for (const [alias, cmd] of Object.entries(commands)) {
            // We could validate here using Zod schema if we exposed it
            if (typeof cmd === 'string') {
                configManager.setCommand(alias, cmd);
                count++;
            }
        }

        successMsg(`Successfully imported ${count} commands`);
    } catch (error: any) {
        errorMsg(error.message);
    }
};

export function registerImportCommand(program: Command) {
    program
        .command('import <file>')
        .description('Import commands from a JSON file')
        .action(importCommandAction);
}
