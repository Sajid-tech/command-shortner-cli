const Conf = require('conf');

const config = new Conf({
  projectName: 'command-shortner',
  defaults: {
    commands: {}
  }
});

module.exports = config;