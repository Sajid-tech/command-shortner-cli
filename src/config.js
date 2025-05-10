const Conf = require('conf');

const config = new Conf({
  projectName: 'cli-productivity-booster',
  defaults: {
    commands: {}
  }
});

module.exports = config;