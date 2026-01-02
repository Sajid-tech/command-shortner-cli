import { spawn } from 'child_process';
import chalk from 'chalk';
import { configManager } from './ConfigManager.js';
export class CommandExecutor {
    getShell() {
        const settings = configManager.getSettings();
        if (settings.shellOverride) {
            return { shell: settings.shellOverride, shellArgs: ['-c'] };
        }
        if (process.platform === 'win32') {
            try {
                return { shell: 'powershell', shellArgs: ['-Command'] };
            }
            catch (e) {
                return { shell: 'cmd.exe', shellArgs: ['/C'] };
            }
        }
        else {
            const userShell = process.env.SHELL || '/bin/bash';
            return { shell: userShell, shellArgs: ['-c'] };
        }
    }
    translateCommand(command) {
        if (process.platform !== 'win32') {
            return command;
        }
        const commandMap = {
            'ls': 'dir',
            'ls -l': 'dir',
            'ls -la': 'dir /a',
            'pwd': 'cd',
            'rm -rf': 'rmdir /s /q',
            'rm': 'del',
            'cp': 'copy',
            'mv': 'move',
            'mkdir -p': 'mkdir',
            'touch': 'echo. >',
            'df -h': 'wmic logicaldisk get size,freespace,caption',
            'free -m': 'wmic OS get FreePhysicalMemory,TotalVisibleMemorySize /Value',
            'top': 'tasklist',
            'ps': 'tasklist',
            'kill': 'taskkill /f /pid',
            'ifconfig': 'ipconfig',
            'netstat -tulpn': 'netstat -ano',
            'ping -c': 'ping -n',
            'grep': 'findstr',
            'cat': 'type',
            'time': 'echo %TIME%',
            'date': 'echo %DATE%',
            'clear': 'cls',
            'which': 'where',
            'man': 'help'
        };
        if (commandMap[command]) {
            return commandMap[command];
        }
        const parts = command.split(' ');
        const cmd = parts[0];
        if (cmd === 'time' && parts.length === 1)
            return 'echo %TIME%';
        if (cmd === 'ping' && command.includes('-c'))
            return command.replace('-c', '-n');
        if (cmd === 'touch')
            return `echo. > ${parts.slice(1).join(' ')}`;
        for (const [unixCmd, winCmd] of Object.entries(commandMap)) {
            const unixCmdParts = unixCmd.split(' ');
            if (unixCmdParts[0] === cmd) {
                if (unixCmdParts.length === 1) {
                    return command.replace(cmd, winCmd);
                }
                else if (command.startsWith(unixCmd + ' ')) {
                    return command.replace(unixCmd, winCmd);
                }
            }
        }
        return command;
    }
    async execute(command, silent = false) {
        const { shell, shellArgs } = this.getShell();
        const translatedCommand = this.translateCommand(command);
        if (!silent && translatedCommand !== command) {
            console.log(chalk.blue(`Translated command: ${translatedCommand}`));
        }
        return new Promise((resolve, reject) => {
            const proc = spawn(shell, [...shellArgs, translatedCommand], {
                stdio: 'inherit',
                shell: true,
            });
            proc.on('error', (error) => reject(error));
            proc.on('close', (code) => {
                if (code !== 0) {
                    reject(new Error(`Command exited with code ${code}`));
                }
                else {
                    resolve();
                }
            });
        });
    }
}
export const commandExecutor = new CommandExecutor();
//# sourceMappingURL=CommandExecutor.js.map