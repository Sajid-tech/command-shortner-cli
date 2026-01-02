import { configManager } from '../core/ConfigManager.js';
import { commandExecutor } from '../core/CommandExecutor.js';
import { errorMsg, successMsg } from '../utils/ui.js';
import chalk from 'chalk';
export const chainCommandAction = async (aliases, options) => {
    try {
        const aliasList = aliases.split(',').map(a => a.trim()).filter(a => a);
        if (aliasList.length === 0) {
            throw new Error('No aliases provided');
        }
        console.log(chalk.cyan(`\n🔗 Chaining ${aliasList.length} commands...\n`));
        for (const alias of aliasList) {
            const command = configManager.getCommand(alias);
            if (!command) {
                throw new Error(`Alias "${alias}" not found in chain`);
            }
            if (!options.silent) {
                console.log(chalk.yellow(`\n▶ Running [${alias}]: ${command}`));
            }
            await commandExecutor.execute(command, options.silent);
        }
        if (!options.silent) {
            successMsg('Chain execution completed successfully!');
        }
    }
    catch (error) {
        errorMsg(error.message);
        process.exitCode = 1;
    }
};
export function registerChainCommand(program) {
    program
        .command('chain-alias <aliases>')
        .description('Run multiple aliases sequentially (comma-separated)')
        .option('-s, --silent', 'Run silently without showing commands being executed')
        .action(chainCommandAction);
}
//# sourceMappingURL=ChainCommand.js.map