var fork = require('child_process').fork;
var path = require('path');

var initMockServer = function (config) {
  config = config || {};
  config.client = config.client || {};
  config.client.mockserver = config.client.mockserver || {};
  var basePath = config.basePath || '';
  var mockServerPath = config.client.mockserver.path;
  var commandLineArgs = config.client.mockserver.args;
  var options = config.client.mockserver.options;

  if (mockServerPath) {
    fork(path.join(basePath, mockServerPath), commandLineArgs, options);
  } else {
    throw new Error('No path for mockserver configured!')
  }
};

initMockServer.$inject = ['config'];

module.exports = {
  'framework:mockserver': ['factory', initMockServer]
};
