/**
 * We need to mock this module because it is not available in the test environment.
 * We use Jest's [manual mocks](https://jestjs.io/docs/manual-mocks#mocking-node-modules).
 */

const StudioApp = {
  getApiOverrides: jest.fn(),
  getUrlEnvironmentPrefix: jest.fn(),
  getITwin: jest.fn(),
  getConnection: jest.fn(),
  showSaveDialog: jest.fn(),
  showOpenDialog: jest.fn(),
  logTrace: jest.fn(),
  logInfo: jest.fn(),
  logWarning: jest.fn(),
  logError: jest.fn(),
  logException: jest.fn().mockImplementation((x) => console.log(x)), // caught errors are logged for easier debugging.
  addSidebarButton: jest.fn(),
  updateSidebarButton: jest.fn(),
  removeSidebarButton: jest.fn(),
  onITwinSelected: jest.fn(),
  onUserPreferencesChanged: jest.fn(),
  onApplicationClose: jest.fn(),
  onApplicationSignOut: jest.fn(),
  resolveAssetPath: jest.fn(),
};

module.exports = { StudioApp };
