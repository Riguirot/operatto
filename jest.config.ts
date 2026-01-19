import type { Config } from "jest";

const config: Config = {
  testEnvironment: "node",

  preset: "ts-jest/presets/default-esm",
  extensionsToTreatAsEsm: [".ts"],

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },

  testMatch: [
    "**/tests/**/*.test.ts",
    "**/tests/**/*.spec.ts",
  ],

  globals: {
    "ts-jest": {
      useESM: true,
      tsconfig: "tsconfig.test.json",
    },
  },
};

export default config;
