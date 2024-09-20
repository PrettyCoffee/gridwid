import "../src/index.css"
import type { Preview } from "@storybook/react"

import { argType } from "lib/storybook"

import { cusomtBlocks } from "./custom-blocks"
import { colors } from "../tailwind/colors"

const parameters: Preview["parameters"] = {
  docs: { ...cusomtBlocks },
  actions: { argTypesRegex: "^on[A-Z].*" },
  backgrounds: {
    default: "dark",
    values: [
      { name: "light", value: "white" },
      { name: "dark", value: colors.background.page },
    ],
  },
  options: {
    storySort: {
      method: "",
      order: ["Primitives", "Buttons"],
      locales: "",
    },
  },
}

const preview: Preview = {
  tags: ["autodocs"],
  decorators: [Story => <Story />],
  parameters,
  argTypes: {
    asChild: argType.hidden(),
    className: argType.hidden(),
    children: argType.hidden(),
  },
}

export default preview
