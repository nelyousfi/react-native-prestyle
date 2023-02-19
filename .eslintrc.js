module.exports = {
  root: true,
  extends: [
    "plugin:react/recommended",
    "plugin:react-native/all",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  plugins: ["prettier", "react", "react-native", "@typescript-eslint"],
  rules: {
    "prettier/prettier": "error",
  },
};
