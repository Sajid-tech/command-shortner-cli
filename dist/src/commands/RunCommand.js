import { configManager } from '../core/ConfigManager.js';
import { commandExecutor } from '../core/CommandExecutor.js';
import { errorMsg } from '../utils/ui.js';
import chalk from 'chalk';
export const runCommandAction = async (alias, options) => {
    try {
        const command = configManager.getCommand(alias);
        if (!command) {
            throw new Error(`No command found for alias "${alias}"`);
        }
        configManager.incrementUsage(alias);
        if (!options.silent) {
            console.log(chalk.yellow(`\n▶ Running: ${command}\n`));
        }
        await commandExecutor.execute(command, options.silent);
    }
    catch (error) {
        errorMsg(error.message);
        process.exitCode = 1;
    }
};
export function registerRunCommand(program) {
    program
        .command('run <alias>')
        .description('Run a command by its alias')
        .option('-s, --silent', 'Run silently without showing command being executed')
        .action(runCommandAction);
}
//# sourceMappingURL=RunCommand.js.map