/**
 * We need to mock this module because it is not available in the test environment.
 * We use Jest's [manual mocks](https://jestjs.io/docs/manual-mocks#mocking-node-modules).
 */

const StudioHost = {
  logTrace: jest.fn(),
  logInfo: jest.fn(),
  logWarning: jest.fn(),
  logError: jest.fn(),
  logException: jest.fn().mockImplementation((x) => console.log(x)), // caught errors are logged for easier debugging.
  appChannel: jest.fn(),
  attachRpcInterface: jest.fn(),
  resolveAssetPath: jest.fn(),
  showSaveDialog: jest.fn(),
  showOpenDialog: jest.fn(),
};

module.exports = { StudioHost };
