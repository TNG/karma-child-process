/* eslint-env node */
const rewire = require('rewire');
const moduleUnderTest = rewire('../index');
const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');
const expect = chai.expect;

chai.use(sinonChai);

describe('The module ', () => {
  let forkStub, revertChildProcessRewire, revertPathRewire;

  beforeEach(() => {
    forkStub = sinon.stub().returns({kill: () => {}});
    revertChildProcessRewire = moduleUnderTest.__set__('childProcess', {fork: forkStub});
    revertPathRewire = moduleUnderTest.__set__('path', {join: (basePath, path) => `${basePath}/${path}`});
  });

  afterEach(() => {
    revertChildProcessRewire();
    revertPathRewire();
  });

  it('should export an object with one property whose value is an array', () => {
    expect(typeof moduleUnderTest).to.equal('object');
    expect(typeof moduleUnderTest['framework:mockserver']).to.equal('object');
    expect(moduleUnderTest['framework:mockserver'][0]).to.equal('factory');
    expect(typeof moduleUnderTest['framework:mockserver'][1]).to.equal('function');
  });

  it('should throw an error if no path to mockserver is configured', () => {
    const initFunction = moduleUnderTest['framework:mockserver'][1];
    const testConfig = {};
    const FINAL_STATE_OF_TEST_CONFIG = {client: {mockserver: {}}};

    expect(() => initFunction(testConfig)).to.throw('No path for mockserver configured!');
    expect(testConfig).to.deep.equal(FINAL_STATE_OF_TEST_CONFIG);
  });

  it('should call fork from child_process with the configured arguments', () => {
    const initFunction = moduleUnderTest['framework:mockserver'][1];
    const testConfig = {
      basePath: 'basePath',
      client: {
        mockserver: {
          path: 'test/path.js',
          args: ['optional command line args'],
          options: {
            additional: 'Options'
          }
        }
      }
    };

    initFunction(testConfig);

    expect(forkStub).to.have.been.calledWith('basePath/test/path.js', ['optional command line args'], {additional: 'Options'});
  });
});
