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
