const iTwinPlugin = require("@itwin/eslint-plugin");

const customLanguageOptions = {
  sourceType: "module",
  parser: require(require.resolve("@typescript-eslint/parser", { paths: [require.resolve("@itwin/eslint-plugin")] })),
  parserOptions: {
    ecmaVersion: "2020",
    tsconfigRootDir: __dirname,
    projectService: true,
  },
};

module.exports = [
  {
    ignores: ["dist/**"],
  },
  {
    files: ["**/*.ts"],
    ...iTwinPlugin.configs.iTwinjsRecommendedConfig,
    languageOptions: customLanguageOptions,
  },
  {
    files: ["**/*.tsx"],
    ...iTwinPlugin.configs.uiConfig,
    languageOptions: customLanguageOptions,
  },
];
