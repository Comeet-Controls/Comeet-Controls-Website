import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});

/** @type {import('jest').Config} */
const config = {
  testEnvironment: "node",
  testMatch: ["**/tests/api/**/*.test.js"],
  setupFiles: ["<rootDir>/tests/setupEnv.mjs"],
  verbose: true,
  testTimeout: 30000,
};

export default createJestConfig(config);
