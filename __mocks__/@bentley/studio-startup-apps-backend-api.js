const { StudioHost } = require("./studio-apps-backend-api");

/**
 * We need to mock this module because it is not available in the test environment.
 * We use Jest's [manual mocks](https://jestjs.io/docs/manual-mocks#mocking-node-modules).
 */
const StudioStartupHost = {
  ...StudioHost,
  setLogLevel: jest.fn(),
  setBriefcase: jest.fn(),
  closeBriefcase: jest.fn(),
  appInstallPath: jest.fn(),
  terminate: jest.fn(),
};

module.exports = { StudioStartupHost };
