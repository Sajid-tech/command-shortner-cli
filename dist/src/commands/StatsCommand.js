import chalk from 'chalk';
import { configManager } from '../core/ConfigManager.js';
export const statsCommandAction = async () => {
    const stats = configManager.getStats();
    const commands = configManager.getCommands();
    if (Object.keys(stats).length === 0) {
        console.log(chalk.yellow('No usage statistics available yet. Run some commands!'));
        return;
    }
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
    console.table(sortedStats);
};
//# sourceMappingURL=StatsCommand.js.map