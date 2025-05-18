const chalk = require('chalk');
const commands = require('../commands');
const { successMsg, errorMsg } = require('../utils/ui');

/**

 * @param {string} aliasString 
 * @returns {Array} 
 */
const parseAliasString = (aliasString) => {
  if (!aliasString || typeof aliasString !== 'string') {
    return [];
  }
  
 
  return aliasString
    .split(/[,\s]+/)
    .map(a => a.trim())
    .filter(a => a); 
};

module.exports = {
  /**
   * @param {string} aliasString 
   * @param {boolean} silent
   */
  runChainAlias: async (aliasString, silent = false) => {
    const aliases = parseAliasString(aliasString);
    
    if (aliases.length === 0) {
      throw new Error("No valid aliases provided");
    }
    
    const commandList = [];
    const allCommands = commands.listCommands();
    
   
    for (const alias of aliases) {
      if (!allCommands[alias]) {
        throw new Error(`Alias "${alias}" not found`);
      }
      commandList.push(allCommands[alias]);
    }
    
    try {
      if (!silent) {
        console.log(chalk.cyan(`\nRunning ${aliases.length} commands in sequence: ${aliases.join(' → ')}\n`));
      }
      
      for (let i = 0; i < commandList.length; i++) {
        const cmd = commandList[i];
        if (!silent) {
          console.log(chalk.yellow(`\n[${i+1}/${commandList.length}] Running: ${aliases[i]} → ${cmd}\n`));
        }
        await commands.runRawCommand(cmd, silent);
      }
      
      if (!silent) {
        successMsg('All commands executed successfully!');
      }
    } catch (error) {
      throw error;
    }
  },
  
 
  parseAliasString
};