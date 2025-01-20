import prettyCozy from "@pretty-cozy/eslint-config"
import ts from "typescript-eslint"

export default ts.config(
  prettyCozy.baseTs,
  prettyCozy.react,
  prettyCozy.tailwind,
  {
    ignores: ["dist", "node_modules"],
    settings: {
      "import/resolver": {
        node: {
          paths: ["src"],
        },
      },
    },
    rules: {
      "check-file/folder-naming-convention": [
        "error",
        { "*/**": "KEBAB_CASE" },
      ],
      "check-file/filename-naming-convention": [
        "error",
        { "*/**": "KEBAB_CASE" },
        { ignoreMiddleExtensions: true },
      ],
      "import/no-cycle": "error",
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
      "tailwind/**",
      "storybook/**",
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
