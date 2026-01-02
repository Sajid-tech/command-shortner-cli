import { configManager } from '../core/ConfigManager.js';
import { successMsg, errorMsg } from '../utils/ui.js';
import fs from 'fs';
import path from 'path';
export const exportCommandAction = async (file = './boost-commands.json') => {
    try {
        const commands = configManager.getCommands();
        const filePath = path.resolve(file);
        fs.writeFileSync(filePath, JSON.stringify(commands, null, 2));
        successMsg(`Commands exported successfully to: ${filePath}`);
    }
    catch (error) {
        errorMsg(error.message);
    }
};
export function registerExportCommand(program) {
    program
        .command('export [file]')
        .description('Export all commands to a JSON file (default: ./boost-commands.json)')
        .action(exportCommandAction);
}
//# sourceMappingURL=ExportCommand.js.map