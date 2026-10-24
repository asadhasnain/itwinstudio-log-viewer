const { StudioApp } = require("./studio-apps-frontend-api");

/**
 * We need to mock this module because it is not available in the test environment.
 * We use Jest's [manual mocks](https://jestjs.io/docs/manual-mocks#mocking-node-modules).
 */

const StudioStartupApp = {
  ...StudioApp,
  setLogLevel: jest.fn(),
  setITwin: jest.fn(),
  setConnection: jest.fn(),
  closeConnection: jest.fn(),
  isBriefcaseCached: jest.fn(),
  downloadAndOpenBriefcase: jest.fn(),
  breadcrumbEvents: {
    onITwinClick: jest.fn(),
    onIModelClick: jest.fn(),
  },
};

module.exports = { StudioStartupApp };
