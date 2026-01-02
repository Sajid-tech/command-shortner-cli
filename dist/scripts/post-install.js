import chalk from 'chalk';
import gradient from 'gradient-string';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import boxen from 'boxen';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const LOGO = `
╔═╗╔═╗╔╦╗╔╦╗╔═╗╔╗╔╔╦╗  ╔═╗╦ ╦╔═╗╦═╗╔╦╗╔╗╔╔═╗╦═╗
║  ║ ║║║║║║║╠═╣║║║ ║║  ╚═╗╠═╣║ ║╠╦╝ ║ ║║║║╣ ╠╦╝
╚═╝╚═╝╩ ╩╩ ╩╩ ╩╝╚╝═╩╝  ╚═╝╩ ╩╚═╝╩╚═ ╩ ╝╚╝╚═╝╩╚═
`;
const getPackageInfo = () => {
    try {
        const possiblePaths = [
            path.join(process.cwd(), 'package.json'),
            path.join(__dirname, '..', '..', 'package.json')
        ];
        for (const pkgPath of possiblePaths) {
            if (fs.existsSync(pkgPath)) {
                return JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
            }
        }
        return { version: '1.0.0' };
    }
    catch (err) {
        return { version: '1.0.0' };
    }
};
const showInstallMessage = async () => {
    const packageJson = getPackageInfo();
    try {
        const titleLines = LOGO.split('\n');
        const coloredTitle = titleLines.map(line => {
            return gradient(['#FF416C', '#FF4B2B', '#F09819', '#FFCC00', '#56CCF2', '#2F80ED', '#A770EF'])(line);
        }).join('\n');
        const githubLink = chalk.cyan.underline('https://github.com/Sajid-tech/command-shortner-cli');
        const content = boxen([
            coloredTitle,
            '',
            chalk.cyan('🚀 Boost your productivity with command aliases!'),
            '',
            chalk.bold('Quick Start:'),
            `${chalk.magenta('•')} ${chalk.bold('Add a command:')}    ${chalk.yellow('boost add <alias> "<command>"')}`,
            `${chalk.magenta('•')} ${chalk.bold('Run a command:')}    ${chalk.yellow('boost run <alias>')}`,
            `${chalk.magenta('•')} ${chalk.bold('List commands:')}    ${chalk.yellow('boost list')}`,
            `${chalk.magenta('•')} ${chalk.bold('Interactive mode:')} ${chalk.yellow('boost interactive')}`,
            '',
            `${chalk.dim('Docs:')} ${githubLink} ${chalk.dim('•')} ${chalk.dim('Help:')} ${chalk.cyan('boost --help')}`,
            '',
            chalk.italic.dim(`Command Shortner v${packageJson.version || '2.2.0'}`)
        ].join('\n'), {
            padding: 1,
            margin: 1,
            borderStyle: 'round',
            borderColor: 'green',
            title: 'Installation Successful!',
            titleAlignment: 'center',
            backgroundColor: '#0A0A1F',
            width: process.stdout.columns > 100 ? 100 : process.stdout.columns - 4,
            dimBorder: false
        });
        console.log(content);
        if (process.platform === 'win32') {
            console.log(boxen(`${chalk.cyan('Windows Users:')}\n` +
                `If you encounter execution policy errors, run:\n` +
                `${chalk.yellow('boost fix-windows')}`, {
                padding: 1,
                margin: { top: 0, bottom: 1 },
                borderStyle: 'round',
                borderColor: 'blue',
                width: process.stdout.columns > 100 ? 100 : process.stdout.columns - 4
            }));
        }
    }
    catch (err) {
        console.log('Welcome to Command Shortner!');
    }
};
showInstallMessage();
//# sourceMappingURL=post-install.js.map