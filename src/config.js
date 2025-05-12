const Conf = require('conf');
const os = require('os');
const path = require('path');

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

if (!config.has('settings')) {
  config.set('settings', {
    showStderr: true,
    shellOverride: null
  });
}

module.exports = config;