/** @type {import('vitest').UserConfig} */
export default {
  test: {
    environment: "node",
    include: ["**/*.test.mjs", "**/*.test.js"],
    globals: true,
  },
};
