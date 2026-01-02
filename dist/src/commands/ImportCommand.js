import { configManager } from '../core/ConfigManager.js';
import { successMsg, errorMsg } from '../utils/ui.js';
import fs from 'fs';
import path from 'path';
export const importCommandAction = async (file) => {
    try {
        const filePath = path.resolve(file);
        if (!fs.existsSync(filePath)) {
            throw new Error(`File not found: ${filePath}`);
        }
        const data = fs.readFileSync(filePath, 'utf8');
        const commands = JSON.parse(data);
        let count = 0;
        for (const [alias, cmd] of Object.entries(commands)) {
            if (typeof cmd === 'string') {
                configManager.setCommand(alias, cmd);
                count++;
            }
        }
        successMsg(`Successfully imported ${count} commands`);
    }
    catch (error) {
        errorMsg(error.message);
    }
};
export function registerImportCommand(program) {
    program
        .command('import <file>')
        .description('Import commands from a JSON file')
        .action(importCommandAction);
}
//# sourceMappingURL=ImportCommand.js.map