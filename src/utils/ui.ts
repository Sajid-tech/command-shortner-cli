import chalk from 'chalk';

export const successMsg = (msg: string) => {
    console.log(chalk.green(`\n✔ ${msg}\n`));
};

export const errorMsg = (msg: string) => {
    console.log(chalk.red(`\n✖ ${msg}\n`));
};

export const warningMsg = (msg: string) => {
    console.log(chalk.yellow(`\n⚠ ${msg}\n`));
};

export const fancyTable = (data: Record<string, string>) => {
    // We can use cli-table3 here if we want, or just custom formatting
    // For now let's use a simple professional list format to match professional vibes
    console.log(chalk.bold.cyan('\n  Saved Commands:\n'));

    if (Object.keys(data).length === 0) {
        console.log(chalk.dim('  No commands found. type "boost add" to create one.'));
        return;
    }

    const maxKeyLen = Math.max(...Object.keys(data).map(k => k.length));

    Object.entries(data).forEach(([alias, cmd]) => {
        const padding = ' '.repeat(maxKeyLen - alias.length + 2);
        console.log(`  ${chalk.green(alias)}${padding}${chalk.dim('→')} ${cmd}`);
    });
    console.log('');
};
