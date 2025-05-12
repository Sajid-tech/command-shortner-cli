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

async function executeCommand(command, silent = false) {
  try {
    const { shell, shellArgs } = getShell();
    const proc = spawn(shell, [...shellArgs, command], {
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
  }
};