const config = {
  roots: ["./src"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  testPathIgnorePatterns: ["/node_modules/", "/__fixtures__/", "/__utils__/"],
};

module.exports = config;
