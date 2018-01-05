/* eslint-env node */
const http = require('http');
const chai = require('chai');
const expect = chai.expect;

describe('The framework ', () => {
  it('should start a mock-server that provides an endpoint responding with a sample response', done => {
    const options = {
      host: 'localhost',
      port: 8000,
      path: '/testEndpoint'
    };

    http.get(options, res => {
      res.on('data', function(chunk) {
        expect(JSON.parse(chunk)).to.deep.equal({test: 'response'});
        done();
      });
    }).end();
  });
});
