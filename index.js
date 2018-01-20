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

var initFunction = function(config) {
  var basePath, childProcessPath, commandLineArgs, options;
  var localConfig = config || {};
  var forkedChildProcess;

  localConfig.client = localConfig.client || {};
  localConfig.client.childProcess = localConfig.client.childProcess || {};
  basePath = localConfig.basePath || '';
  childProcessPath = localConfig.client.childProcess.path;
  commandLineArgs = localConfig.client.childProcess.args;
  options = localConfig.client.childProcess.options;

  if (childProcessPath) {
    forkedChildProcess = childProcess.fork(path.join(basePath, childProcessPath), commandLineArgs, options);
    process.on('exit', function() {
      forkedChildProcess.kill();
    });
  } else {
    throw new Error('No path for child process configured!');
  }
};

initFunction.$inject = ['config'];

module.exports = {
  'framework:child-process': ['factory', initFunction]
};
