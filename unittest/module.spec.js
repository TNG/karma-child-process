/* eslint-env node */
const rewire = require('rewire');
const moduleUnderTest = rewire('../index');
const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');
const expect = chai.expect;

chai.use(sinonChai);

describe('The module ', () => {
  let forkStub, killStub, revertChildProcessRewire, revertPathRewire;

  beforeEach(() => {
    killStub = sinon.stub();
    forkStub = sinon.stub().returns({kill: killStub});
    revertChildProcessRewire = moduleUnderTest.__set__('childProcess', {fork: forkStub});
    revertPathRewire = moduleUnderTest.__set__('path', {join: (basePath, path) => `${basePath}/${path}`});
  });

  afterEach(() => {
    revertChildProcessRewire();
    revertPathRewire();
  });

  it('should export an object with one property whose value is an array', () => {
    expect(typeof moduleUnderTest).to.equal('object');
    expect(typeof moduleUnderTest['framework:child-process']).to.equal('object');
    expect(moduleUnderTest['framework:child-process'][0]).to.equal('factory');
    expect(typeof moduleUnderTest['framework:child-process'][1]).to.equal('function');
  });

  it('should throw an error if no path to the child process file is configured', () => {
    const initFunction = moduleUnderTest['framework:child-process'][1];
    const testConfig = {};
    const FINAL_STATE_OF_TEST_CONFIG = {client: {childProcess: {}}};

    expect(() => initFunction(testConfig)).to.throw('No path for child process configured!');
    expect(testConfig).to.deep.equal(FINAL_STATE_OF_TEST_CONFIG);
  });

  it('should call fork from child_process with the configured arguments', () => {
    const initFunction = moduleUnderTest['framework:child-process'][1];
    const testConfig = {
      basePath: 'basePath',
      client: {
        childProcess: {
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

  it('should call the kill function for the child process on exit', () => {
    const initFunction = moduleUnderTest['framework:child-process'][1];
    const testConfig = {
      client: {
        childProcess: {path: 'test/path.js'}
      }
    };

    initFunction(testConfig);

    process.emit('exit');

    expect(killStub).to.have.been.calledOnce;
  });
});
