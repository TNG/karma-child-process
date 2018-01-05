/* eslint-env node */
const karmaConfig = {
  frameworks: ['mocha', 'browserify', 'mockserver'],
  browsers: ['Firefox'],
  client: {
    mocha: {
      timeout: 15000,
      bail: true
    },
    mockserver: {
      path: 'mock-server.js',
      args: [],
      options: {}
    }
  },
  singleRun: true,
  preprocessors: {
    'integ-test.spec.js': ['browserify']
  },
  files: ['integ-test.spec.js']
};

module.exports = function(config) {
  config.set(karmaConfig);
};
