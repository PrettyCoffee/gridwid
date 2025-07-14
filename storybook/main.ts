import { StorybookConfig } from "@storybook/react-vite"

export default {
  stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],

  addons: [
    "@storybook/addon-links",
    "@storybook/addon-docs",
    "@storybook/addon-a11y",
  ],

  framework: {
    name: "@storybook/react-vite",
    options: { strictMode: true },
  },

  typescript: {
    reactDocgen: "react-docgen-typescript",
  },
} satisfies StorybookConfig
