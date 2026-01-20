import type { Config } from "jest";

const config: Config = {
  testEnvironment: "node",

  preset: "ts-jest/presets/default-esm",
  extensionsToTreatAsEsm: [".ts"],

  transform: {
    "^.+\\.ts$": [
      "ts-jest",
      {
        useESM: true,
        tsconfig: "tsconfig.test.json",
      },
    ],
  },

  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
    "@/(.*)$": "<rootDir>/src/$1",
  },

  testMatch: [
    "**/tests/**/*.test.ts",
    "**/tests/**/*.spec.ts",
  ],

  setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"],

};

export default config;
