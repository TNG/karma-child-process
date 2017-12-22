/*
Copyright 2018 TNG Technology Consulting GmbH

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
 */
/* eslint-env node */
var childProcess = require('child_process');
var path = require('path');

var initMockServer = function(config) {
  var basePath, mockServerPath, commandLineArgs, options;
  var localConfig = config || {};
  var mockServer;

  localConfig.client = localConfig.client || {};
  localConfig.client.mockserver = localConfig.client.mockserver || {};
  basePath = localConfig.basePath || '';
  mockServerPath = localConfig.client.mockserver.path;
  commandLineArgs = localConfig.client.mockserver.args;
  options = localConfig.client.mockserver.options;

  if (mockServerPath) {
    mockServer = childProcess.fork(path.join(basePath, mockServerPath), commandLineArgs, options);
  } else {
    throw new Error('No path for mockserver configured!');
  }
  process.on('exit', () => mockServer.kill());
};

initMockServer.$inject = ['config'];

module.exports = {
  'framework:mockserver': ['factory', initMockServer]
};
