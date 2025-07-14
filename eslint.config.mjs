// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format

import prettyCozy from "@pretty-cozy/eslint-config"
import { defineConfig, globalIgnores } from "eslint/config"
import checkFile from "eslint-plugin-check-file"
import storybook from "eslint-plugin-storybook"

export default defineConfig(
  prettyCozy.baseTs,
  prettyCozy.react,
  prettyCozy.tailwind,
  prettyCozy.vitest,
  storybook.configs["flat/recommended"],
  globalIgnores(["dist", "node_modules", "!.storybook"]),

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
    settings: {
      "import/resolver": {
        node: {
          paths: ["src"],
        },
      },
    },
    plugins: { checkFile },
    rules: {
      "checkFile/folder-naming-convention": ["error", { "*/**": "KEBAB_CASE" }],
      "checkFile/filename-naming-convention": [
        "error",
        { "*/**": "KEBAB_CASE" },
        { ignoreMiddleExtensions: true },
      ],
      "import/no-restricted-paths": [
        "error",
        {
          zones: [
            // disables cross-feature imports:
            // e.g. src/features/discussions should not import from src/features/comments, etc.
            {
              target: "./src/features/taskbar",
              from: "./src/features",
              except: ["./taskbar"],
            },
            // enforce unidirectional codebase:

            // e.g. src/app can import from src/features but not the other way around
            {
              target: "./src/features",
              from: "./src/app",
            },

            // e.g. src/features and src/app can import from these shared modules but not the other way around
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

  {
    files: [".storybook/**"],
    plugins: { checkFile },
    rules: {
      "checkFile/folder-naming-convention": "off",
    },
  },

  prettyCozy.prettier
)
