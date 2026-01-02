import { configManager } from '../core/ConfigManager.js';
import { successMsg, errorMsg } from '../utils/ui.js';
export const removeCommandAction = async (alias) => {
    try {
        configManager.removeCommand(alias);
        successMsg(`Alias "${alias}" removed successfully!`);
    }
    catch (error) {
        errorMsg(error.message);
    }
};
export function registerRemoveCommand(program) {
    program
        .command('remove <alias>')
        .description('Remove a command alias')
        .action(removeCommandAction);
}
//# sourceMappingURL=RemoveCommand.js.map