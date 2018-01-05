# karma-mockserver

Framework for karma-test-runner which forks a process on startup to run a 
separate node process during the karma tests. Internally it uses the `fork` method 
of the `child_process` node module.

## Intention
The framework is intended to run a separate node process during karma tests. 
The process is supposed to mock a (http) server. This is particularly useful 
for E2E-tests without the need for a complete Docker-setup. Therefore the test 
setup can start faster, with less costs for infrastructure. 

## Installation
To install the `karma-mockserver` framework in your local directory type
```
npm install karma-mockserver --save-dev
```
Of course you need to install `karma` as well.
```
npm install karma --save-dev
```

## Configuration
For configuration put this into your `karma.conf.js`:
```
config = {
  frameworks: ['mockserver'],
  client: {
    mockserver: {
      path: 'path/to/mock-server.js',
      args: [],
      options: {}
    }
  }
}
```
The `path` is a mandatory argument providing the location of the node-script 
that should be started. The path is a relative path based on the `basePath` 
of the project. The `args` and `options` arguments are optional and if provided 
directly forwarded to the `fork` method. 
 
To execute the karma framework just run karma.
```
./node_modules/karma/bin/karma start
```
 
The `mock-server.js` should be node-script that is supposed to start a server. 
A possible example might look like so:
```
/* eslint-env node */
const express = require('express');
const bodyParser = require('body-parser');
 
const app = express();
 
app.use(bodyParser.json());
 
let mainResponse = {};
 
app.post('/setMainResponseForTesting', (req, res) => {
  mainResponse = req.body;
  res.header('Access-Control-Allow-Origin', 'http://localhost:9876');
  res.json(req.body);
});
 
app.get('/productiveEndpoint', (req, res) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:9876');
  res.json(mainResponse);
});
 
app.get('/reset', (req, res) => {
  mainResponse = {};
  res.header('Access-Control-Allow-Origin', 'http://localhost:9876');
  res.json('Reset!');
});
 
app.listen(8000);
```
In this case the express-server would run on `localhost` port 8000. But you may configure 
this via the `args` argument provided in the karma configuration. This is very 
basic example. For real-world problems you might need a more complex setup. 
Remember that you are not limited to `express`. You may use any node-script that 
provides the desired solution for your development. 

## Shutdown
During shutdown of the karma server the forked process is stopped as well. 
There is no reset of the server as long as the karma server is running, 
especially not between different runs of your test suite or even single tests. 
If you want to achieve this then use the `/reset` Endpoint on your server and
trigger it programmatically.

## License
This project is licensed under the Apache 2.0 license. For further information 
have a look into the `LICENSE` file in the project root folder.
