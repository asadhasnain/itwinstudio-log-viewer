/** @type { import("jest").Config } */
const config = {
  // NOTE: when `projects` is used, jest ignores top level options such as `transform` and `testEnvironment`,
  // so every project has to configure its own. Passing `tsconfig` through `globals` is deprecated in ts-jest 29.
  projects: [
    {
      displayName: "backend",
      testEnvironment: "node",
      testMatch: ["<rootDir>/backend/**/*.test.ts"],
      transform: {
        "^.+\\.tsx?$": ["ts-jest", { tsconfig: "<rootDir>/backend/tsconfig.json" }],
      },
    },
    {
      displayName: "frontend",
      testEnvironment: "jsdom",
      testMatch: ["<rootDir>/frontend/**/*.test.ts", "<rootDir>/frontend/**/*.test.tsx"],
      moduleNameMapper: {
        "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
          "<rootDir>/__mocks__/fileMock.js",
        "\\.(css|less|scss|sass)$": "identity-obj-proxy",
      },
      transform: {
        "^.+\\.tsx?$": ["ts-jest", { tsconfig: "<rootDir>/frontend/tsconfig.json" }],
      },
    },
  ],
};

module.exports = config;
