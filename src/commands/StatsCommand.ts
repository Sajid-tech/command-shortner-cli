import chalk from 'chalk';
import { configManager } from '../core/ConfigManager.js';
import { fancyTable } from '../utils/ui.js';

export const statsCommandAction = async () => {
    const stats = configManager.getStats();
    const commands = configManager.getCommands();

    if (Object.keys(stats).length === 0) {
        console.log(chalk.yellow('No usage statistics available yet. Run some commands!'));
        return;
    }

    // Convert stats to array and sort
    const sortedStats = Object.entries(stats)
        .sort(([, a], [, b]) => b - a)
        .map(([alias, count]) => {
            return {
                Alias: chalk.cyan(alias),
                'Run Count': count,
                Command: commands[alias] ? chalk.gray(commands[alias]) : chalk.red('(deleted)')
            };
        });

    console.log(chalk.bold.green('\n📊 Top Used Commands:\n'));
    // We can use console.table or reuse fancyTable if adapted, requires array of obj.
    // Console.table is simple and builtin
    console.table(sortedStats);
};
