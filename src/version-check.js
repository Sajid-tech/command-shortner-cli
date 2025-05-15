const chalk = require('chalk');
const axios = require('axios');
const config = require('./config');
const packageJson = require('../package.json');

// const VERSION_CHECK_INTERVAL = 24 * 60 * 60 * 1000; 
const VERSION_CHECK_INTERVAL = 1 * 60 ;


module.exports = async () => {
  try {
    const now = Date.now();
    const lastCheck = config.get('lastVersionCheck') || 0;
    
   
    if (now - lastCheck < VERSION_CHECK_INTERVAL) return;

 
    config.set('lastVersionCheck', now);

   
    const { data } = await axios.get(`https://registry.npmjs.org/${packageJson.name}/latest`);
    const latestVersion = data.version;

    if (latestVersion !== packageJson.version) {
      const updateMessage = chalk.yellow.bold(`
      ╔══════════════════════════════════════════════════╗
      ║                                                  ║
      ║  New version available! ${chalk.green(packageJson.version)} → ${chalk.green.bold(latestVersion)}            ║
      ║  Run ${chalk.cyan('npm install -g command-shortner')} to update   ║
      ║                                                  ║
      ╚══════════════════════════════════════════════════╝
      `);
      
      console.log(updateMessage);
    }
  } catch (error) {

  }
};