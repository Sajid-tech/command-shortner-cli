const chalk = require('chalk');
const commands = require('../commands');
const { successMsg, errorMsg } = require('../utils/ui');

module.exports = {
  runChain: async (commandString, silent = false) => {
    const commandList = commandString.split('&&').map(cmd => cmd.trim());
    
    try {
      for (const cmd of commandList) {
        await commands.runRawCommand(cmd, silent);
      }
      if (!silent) {
        successMsg('All commands executed successfully!');
      }
    } catch (error) {
      throw error;
    }
  },

  runChainAlias: async (aliasString, silent = false) => {
    const aliases = aliasString.split(',').map(a => a.trim());
    const commandList = [];
    
   
    const allCommands = commands.listCommands();
    for (const alias of aliases) {
      if (!allCommands[alias]) {
        throw new Error(`Alias "${alias}" not found`);
      }
      commandList.push(allCommands[alias]);
    }

    try {
      for (const cmd of commandList) {
        await commands.runRawCommand(cmd, silent);
      }
      if (!silent) {
        successMsg('All aliases executed successfully!');
      }
    } catch (error) {
      throw error;
    }
  }
};