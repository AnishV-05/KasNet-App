module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      ["feat", "fix", "perf", "test", "docs", "chore", "style", "ci", "refactor"],
    ],
  },
};
