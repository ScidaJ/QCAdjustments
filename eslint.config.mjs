import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

import eslintConfigPrettier from "eslint-config-prettier";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: [
      "**/node_modules",
      "tmp",
      "dist",
      "types",
      "**/*.json",
      "**/*.txt",
      "**/*.exe",
    ],
  },
  ...compat.extends(
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
  ),
  {
    plugins: {
      "@typescript-eslint": typescriptEslint,
    },

    languageOptions: {
      parser: tsParser,
    },

    rules: {
      "@typescript-eslint/no-explicit-any": 0,
      "@typescript-eslint/no-unused-vars": 1,
      "@typescript-eslint/no-empty-interface": 0,
      "@typescript-eslint/no-namespace": 0,
      "@typescript-eslint/comma-dangle": 1,
      "@typescript-eslint/func-call-spacing": 2,
      "@typescript-eslint/quotes": 1,
      "@typescript-eslint/brace-style": ["warn", "allman"],

      "@typescript-eslint/naming-convention": [
        "warn",
        {
          selector: "default",
          format: ["camelCase"],
          leadingUnderscore: "allow",
        },
        {
          selector: "typeLike",
          format: ["PascalCase"],
        },
        {
          selector: "objectLiteralProperty",
          format: ["PascalCase", "camelCase"],
          leadingUnderscore: "allow",
        },
        {
          selector: "typeProperty",
          format: ["PascalCase", "camelCase"],
          leadingUnderscore: "allow",
        },
        {
          selector: "enumMember",
          format: ["UPPER_CASE"],
        },
      ],

      "@typescript-eslint/indent": ["warn", 4],

      "@typescript-eslint/no-unused-expressions": [
        "warn",
        {
          allowShortCircuit: false,
          allowTernary: false,
        },
      ],

      "@typescript-eslint/keyword-spacing": [
        "warn",
        {
          before: true,
          after: true,
        },
      ],

      "@typescript-eslint/explicit-module-boundary-types": [
        "warn",
        {
          allowArgumentsExplicitlyTypedAsAny: true,
        },
      ],
    },
  },
  {
    files: ["**/*.mjs", "**/*.ts"],

    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  eslintConfigPrettier,
];
