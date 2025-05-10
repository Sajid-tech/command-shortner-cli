const chalk = require('chalk');
const { spawn, execSync } = require('child_process');
const os = require('os');
const fs = require('fs');
const path = require('path');
const config = require('./config');

// Detect the correct shell to use based on platform
function getShell() {
  const settings = config.get('settings') || {};
  
  // If user has specified a shell override, use it
  if (settings.shellOverride) {
    return settings.shellOverride;
  }
  
  if (process.platform === 'win32') {
    // On Windows, prefer PowerShell but fall back to cmd
    try {
      execSync('powershell -Command "exit"', { stdio: 'ignore' });
      return { shell: 'powershell', shellArgs: ['-Command'] };
    } catch (e) {
      return { shell: 'cmd.exe', shellArgs: ['/C'] };
    }
  } else {
    // On Unix-like systems, use the user's preferred shell or default to bash
    const userShell = process.env.SHELL || '/bin/bash';
    return { shell: userShell, shellArgs: ['-c'] };
  }
}

module.exports = {
  addCommand: (alias, command) => {
    const commands = config.get('commands') || {};
    commands[alias] = command;
    config.set('commands', commands);
    return true;
  },

  removeCommand: (alias) => {
    const commands = config.get('commands') || {};
    if (commands[alias]) {
      delete commands[alias];
      config.set('commands', commands);
      return true;
    }
    return false;
  },

  listCommands: () => {
    const commands = config.get('commands') || {};
    if (Object.keys(commands).length === 0) {
      console.log(chalk.yellow('No commands saved yet.'));
      return;
    }

    console.log(chalk.blue.bold('\nSaved Command Aliases:\n'));
    Object.entries(commands).forEach(([alias, command]) => {
      console.log(chalk.cyan(`${alias}:`), command);
    });
  },

  runCommand: (alias, silent = false) => {
    const commands = config.get('commands') || {};
    const command = commands[alias];

    if (!command) {
      console.log(chalk.red(`No command found for alias "${alias}"`));
      return;
    }

    if (!silent) {
      console.log(chalk.yellow(`Running: ${command}\n`));
    }

    try {
      // Get the appropriate shell for this platform
      const { shell, shellArgs } = getShell();
      
      // Create a new process with proper stdio inheritance
      const proc = spawn(shell, [...shellArgs, command], {
        stdio: 'inherit',
        shell: true
      });

      // Handle process completion
      proc.on('error', (error) => {
        console.error(chalk.red(`Error executing command: ${error.message}`));
      });

      proc.on('close', (code) => {
        if (code !== 0 && !silent) {
          console.log(chalk.yellow(`\nCommand exited with code ${code}`));
        }
      });
    } catch (error) {
      console.error(chalk.red(`Failed to execute command: ${error.message}`));
    }
  },

  generateWindowsFix: () => {
    if (process.platform !== 'win32') {
      console.log(chalk.yellow('This command is only needed on Windows systems.'));
      return;
    }

    try {
      // Get the path to the global npm bin directory
      const npmPath = execSync('npm root -g').toString().trim();
      const npmBinPath = path.join(npmPath, '..', '.bin');
      
      // Create a batch file that can be executed directly
      const batchFilePath = path.join(os.homedir(), 'boost.cmd');
      const batchContent = `@echo off
node "${path.join(npmBinPath, 'boost')}" %*`;

      fs.writeFileSync(batchFilePath, batchContent);

      console.log(chalk.green(`
Windows fix created successfully!

A batch file has been created at: ${batchFilePath}

You can now:
1. Copy this file to a directory in your PATH
   (e.g., copy to C:\\Windows or add ${os.homedir()} to your PATH)
2. Run 'boost' commands directly from PowerShell or Command Prompt

For PowerShell execution policy issues, you may need to:
- Run PowerShell as Administrator and execute:
  Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
`));
    } catch (error) {
      console.error(chalk.red(`Failed to create Windows fix: ${error.message}`));
    }
  },

  // New function to set configuration options
  setConfig: (option, value) => {
    const settings = config.get('settings') || {};
    settings[option] = value;
    config.set('settings', settings);
    console.log(chalk.green(`Configuration ${option} set to ${value}`));
  }
};