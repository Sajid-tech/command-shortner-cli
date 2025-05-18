const chalk = require('chalk');
const { spawn, execSync } = require('child_process');
const os = require('os');
const fs = require('fs');
const path = require('path');
const config = require('./config');
const { fancyTable, successMsg, errorMsg } = require('./utils/ui');

function getShell() {
  const settings = config.get('settings') || {};
  
  if (settings.shellOverride) {
    return settings.shellOverride;
  }
  
  if (process.platform === 'win32') {
    try {
      execSync('powershell -Command "exit"', { stdio: 'ignore' });
      return { shell: 'powershell', shellArgs: ['-Command'] };
    } catch (e) {
      return { shell: 'cmd.exe', shellArgs: ['/C'] };
    }
  } else {
    const userShell = process.env.SHELL || '/bin/bash';
    return { shell: userShell, shellArgs: ['-c'] };
  }
}
function translateCommand(command) {
  // Only translate if on Windows
  if (process.platform !== 'win32') {
    return command;
  }

  // Command mapping for Windows (UNIX → Windows)
  const commandMap = {
    // File operations
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
    
    // System info
    'df -h': 'wmic logicaldisk get size,freespace,caption',
    'free -m': 'wmic OS get FreePhysicalMemory,TotalVisibleMemorySize /Value',
    'top': 'tasklist',
    'ps': 'tasklist',
    'kill': 'taskkill /f /pid',
    
    // Network
    'ifconfig': 'ipconfig',
    'netstat -tulpn': 'netstat -ano',
    'ping -c': 'ping -n',
    
    // Text processing
    'grep': 'findstr',
    'cat': 'type',
    
    // Time/date
    'time': 'echo %TIME%',
    'date': 'echo %DATE%',
    
    // Misc
    'clear': 'cls',
    'which': 'where',
    'man': 'help'
  };

 
  if (commandMap[command]) {
    return commandMap[command];
  }

 
  const parts = command.split(' ');
  const cmd = parts[0];
  
  
  if (cmd === 'time' && parts.length === 1) {
    return 'echo %TIME%';
  }
  
  if (cmd === 'ping' && command.includes('-c')) {
    return command.replace('-c', '-n');
  }
  
  if (cmd === 'touch') {
    const file = parts.slice(1).join(' ');
    return `echo. > ${file}`;
  }

 
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


async function executeCommand(command, silent = false) {
  try {
    const { shell, shellArgs } = getShell();
    
    
    const translatedCommand = translateCommand(command);
    
    if (!silent && translatedCommand !== command) {
      console.log(chalk.blue(`Translated command: ${translatedCommand}`));
    }

    const proc = spawn(shell, [...shellArgs, translatedCommand], {
      stdio: 'inherit',
      shell: true
    });

    return new Promise((resolve, reject) => {
      proc.on('error', (error) => {
        reject(error);
      });

      proc.on('close', (code) => {
        if (code !== 0) {
          reject(new Error(`Command exited with code ${code}`));
        } else {
          resolve();
        }
      });
    });
  } catch (error) {
    throw error;
  }
}

module.exports = {
  addCommand: (alias, command) => {
    const commands = config.get('commands') || {};
    if (commands[alias]) {
      throw new Error(`Alias "${alias}" already exists`);
    }
    commands[alias] = command;
    config.set('commands', commands);
    return true;
  },

  removeCommand: (alias) => {
    const commands = config.get('commands') || {};
    if (!commands[alias]) {
      throw new Error(`Alias "${alias}" not found`);
    }
    delete commands[alias];
    config.set('commands', commands);
    return true;
  },

  listCommands: () => {
    const commands = config.get('commands') || {};
    if (Object.keys(commands).length === 0) {
      return { isEmpty: true };
    }
    return commands;
  },

  runCommand: async (alias, silent = false) => {
    const commands = config.get('commands') || {};
    const command = commands[alias];

    if (!command) {
      throw new Error(`No command found for alias "${alias}"`);
    }

    if (!silent) {
      console.log(chalk.yellow(`\n▶ Running: ${command}\n`));
    }

    await executeCommand(command, silent);
  },

  runRawCommand: async (command, silent = false) => {
    if (!silent) {
      console.log(chalk.yellow(`\n▶ Running: ${command}\n`));
    }
    await executeCommand(command, silent);
  },

  generateWindowsFix: () => {
    if (process.platform !== 'win32') {
      throw new Error('This command is only needed on Windows systems.');
    }

    try {
      const npmPath = execSync('npm root -g').toString().trim();
      const npmBinPath = path.join(npmPath, '..', '.bin');
      const batchFilePath = path.join(os.homedir(), 'boost.cmd');
      const batchContent = `@echo off\nnode "${path.join(npmBinPath, 'boost')}" %*`;

      fs.writeFileSync(batchFilePath, batchContent);
      return batchFilePath;
    } catch (error) {
      throw error;
    }
  },

  exportCommands: (filePath = './boost-commands.json') => {
    const commands = config.get('commands') || {};
    try {
      fs.writeFileSync(filePath, JSON.stringify(commands, null, 2));
      return path.resolve(filePath);
    } catch (error) {
      throw error;
    }
  },

  importCommands: (filePath) => {
    try {
      const data = fs.readFileSync(filePath, 'utf8');
      const commands = JSON.parse(data);
      config.set('commands', commands);
      return Object.keys(commands).length;
    } catch (error) {
      throw error;
    }
  },

    translateCommand

};