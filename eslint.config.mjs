import js from '@eslint/js';
import babelParser from "@babel/eslint-parser";

export default [
  js.configs.recommended,
  {
    files: ["src/**/*.ts"],
    languageOptions: {
      ecmaVersion: 7,
      sourceType: "module",
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          babelrc: false,
          configFile: false,
          presets: ["@babel/preset-env"],
        },
      },
    },
    rules: {
      "no-console": 1,
      "no-unused-vars": "error",
      semi: "error",
      "prefer-const": "error",
    },
    ignores: [
      "node_modules/*",
    ]
  }
];
