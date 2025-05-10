const Conf = require('conf');
const os = require('os');
const path = require('path');

// Ensure config is stored in a consistent location across platforms
const configDir = path.join(os.homedir(), '.command-shortner');

const config = new Conf({
  projectName: 'command-shortner',
  cwd: configDir,
  defaults: {
    commands: {},
    settings: {
      showStderr: true,
      shellOverride: null
    }
  }
});

// Initialize settings if they don't exist
if (!config.has('settings')) {
  config.set('settings', {
    showStderr: true,
    shellOverride: null
  });
}

module.exports = config;