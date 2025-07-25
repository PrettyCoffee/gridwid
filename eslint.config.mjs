import { readdirSync } from "node:fs"

import prettyCozy from "@pretty-cozy/eslint-config"
import { defineConfig, globalIgnores } from "eslint/config"
import checkFile from "eslint-plugin-check-file"
import storybook from "eslint-plugin-storybook"

export default defineConfig(
  prettyCozy.baseTs,
  prettyCozy.react,
  prettyCozy.tailwind({ entryPoint: "src/index.css" }),
  prettyCozy.vitest,
  storybook.configs["flat/recommended"],
  globalIgnores(["dist", "node_modules", "!.storybook"]),

  {
    // For some unknown reason vscode detects this rule as "warn", even when being disabled by prettyCozy.tailwind
    rules: {
      "better-tailwindcss/enforce-consistent-line-wrapping": "off",
    },
  },

  {
    name: "local-rules/lib-imports",
    ignores: [".storybook/**", "src/lib/**"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@yaasl/*"],
              importNamePattern: "^",
              message: "Import from lib/yaasl instead.",
            },
            {
              group: ["storybook", "@storybook/*", "!lib/storybook"],
              importNamePattern: "^",
              message: "Import from lib/storybook instead.",
            },
          ],
        },
      ],
    },
  },

  {
    name: "situational-rules",
    rules: {
      // activate for temporary testing
      // "import/no-cycle": "error",
    },
  },

  {
    name: "local-rules/check-file-naming",
    plugins: { checkFile },
    rules: {
      "checkFile/folder-naming-convention": ["error", { "*/**": "KEBAB_CASE" }],
      "checkFile/filename-naming-convention": [
        "error",
        { "*/**": "KEBAB_CASE" },
        { ignoreMiddleExtensions: true },
      ],
    },
  },

  {
    name: "local-rules/check-file-naming",
    files: [".storybook/**"],
    plugins: { checkFile },
    rules: {
      "checkFile/folder-naming-convention": "off",
    },
  },

  {
    settings: {
      "import/resolver": {
        node: {
          paths: ["src"],
        },
      },
    },
    rules: {
      "import/no-restricted-paths": [
        "error",
        {
          zones: [
            // disables cross-feature imports:
            // e.g. src/features/notes should not import from src/features/taskbar, etc.
            ...readdirSync("./src/features").map(feature => ({
              target: `./src/features/${feature}`,
              from: "./src/features",
              except: [`./${feature}`],
            })),

            // enforce unidirectional codebase:

            // src/app can import from src/features but not the other way around
            {
              target: "./src/features",
              from: "./src/app",
            },

            // src/data can only import from self + utils + lib + types
            {
              target: "./src/data",
              from: "./src",
              except: ["./data", "./utils", "./lib", "./types"],
            },

            // src/features and src/app can import from these shared modules but not the other way around
            {
              target: [
                "./src/components",
                "./src/hooks",
                "./src/lib",
                "./src/types",
                "./src/utils",
              ],
              from: ["./src/features", "./src/app"],
            },
          ],
        },
      ],
    },
  },

  {
    files: [
      ".storybook/**",
      "tailwind/**",
      "src/lib/storybook.ts",
      "**/*.stories.*",
    ],
    rules: {
      "import/no-extraneous-dependencies": "off",
    },
  },

  {
    files: ["**/*.test.*", "src/testing/**"],
    rules: {
      "import/no-extraneous-dependencies": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
    },
  },

  prettyCozy.prettier
)
