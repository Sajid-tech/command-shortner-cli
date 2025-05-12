

const chalk = require('chalk');
const gradient = require('gradient-string');

const LOGO = `
╔═╗╔═╗╔╦╗╔╦╗╔═╗╔╗╔╔╦╗  ╔═╗╦ ╦╔═╗╦═╗╔╦╗╔╗╔╔═╗╦═╗
║  ║ ║║║║║║║╠═╣║║║ ║║  ╚═╗╠═╣║ ║╠╦╝ ║ ║║║║╣ ╠╦╝
╚═╝╚═╝╩ ╩╩ ╩╩ ╩╝╚╝═╩╝  ╚═╝╩ ╩╚═╝╩╚═ ╩ ╝╚╝╚═╝╩╚═
`;

const showInstallMessage = async () => {
  try {
    const { default: boxen } = await import('boxen');
    
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
      `${chalk.magenta('•')} ${chalk.bold('Remove command:')}   ${chalk.yellow('boost remove <alias>')}`,
      `${chalk.magenta('•')} ${chalk.bold('Chain-alias commands:')}   ${chalk.yellow('boost chain-alias cmd1,cmd2')}`,
      `${chalk.magenta('•')} ${chalk.bold('Interactive mode:')} ${chalk.yellow('boost interactive')}`,
      '',
      `${chalk.dim('Documentation:')} ${githubLink} ${chalk.dim('•')} ${chalk.dim('Help:')} ${chalk.cyan('boost --help')}`,
      '',
      chalk.italic.dim('Created by Sajid Hussain')
    ].join('\n'), {
      padding: 1,
      margin: 1,
      borderStyle: 'round',
      borderColor: 'cyan',
      backgroundColor: '#0A0A1F',
      float: 'left', 
      width: '100%',  
      dimBorder: false
    });
    
    console.log(content);
    
    if (process.platform === 'win32') {
      console.log(
        boxen(
          `${chalk.cyan('Windows Users:')}\n` +
          `If you encounter issues with PowerShell execution policy, run:\n` +
          `${chalk.yellow('boost fix-windows')}\n` +
          `Or set execution policy: ${chalk.green('Set-ExecutionPolicy RemoteSigned -Scope CurrentUser')}`, 
          {
            padding: 1,
            margin: { top: 0, bottom: 1 },
            borderStyle: 'round',
            borderColor: 'blue',
            float: 'left',  
            width: '100%'   
          }
        )
      );
    }
    
    console.log(
      boxen(
        chalk.magenta('Enjoy your productivity boost! 🚀'), 
        {
          padding: { left: 2, right: 2, top: 0, bottom: 0 },
          margin: { top: 0, bottom: 0 },
          borderStyle: 'round',
          borderColor: 'magenta',
          float: 'left',  
          width: '100%'   
        }
      )
    );
  } catch (err) {
    // Fallback 
    console.log(chalk.bold.magenta('\n✨ COMMAND SHORTNER'));
    console.log(chalk.dim('─────────────────'));
    console.log(chalk.bold('\n✓ Installation Complete\n'));
    console.log(chalk.bold('Commands:'));
    console.log(`  ${chalk.blue('•')} Add:      ${chalk.yellow('boost add <alias> "<command>"')}`);
    console.log(`  ${chalk.blue('•')} Run:      ${chalk.yellow('boost run <alias>')}`);
    console.log(`  ${chalk.blue('•')} List:     ${chalk.yellow('boost list')}`);
    console.log(`  ${chalk.blue('•')} Remove:   ${chalk.yellow('boost remove <alias>')}`);
    console.log(`  ${chalk.blue('•')} Chain:    ${chalk.yellow('boost chain "cmd1 && cmd2"')}`);
    console.log(`  ${chalk.blue('•')} Interactive: ${chalk.yellow('boost interactive')}`);
    console.log(`\n${chalk.dim('Docs:')} ${chalk.cyan('https://github.com/Sajid-tech/command-shortner-cli')}`);
    console.log(`${chalk.italic.dim('\nCreated by Sajid Hussain')}`);
  }
};

showInstallMessage();