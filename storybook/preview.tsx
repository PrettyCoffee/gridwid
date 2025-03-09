import "../src/index.css"
import { PropsWithChildren, useEffect } from "react"

import type { Preview } from "@storybook/react"
import { glob } from "goober"

import { DialogProvider } from "components/ui/dialog"
import { Toaster } from "components/ui/toaster"
import { Tooltip } from "components/ui/tooltip"
import { argType } from "lib/storybook"

import { cusomtBlocks } from "./custom-blocks"
import { theme } from "../tailwind/theme"

const themeTokens = theme.getTokens()

const parameters: Preview["parameters"] = {
  docs: { ...cusomtBlocks },
  actions: { argTypesRegex: "^on[A-Z].*" },
  backgrounds: {
    default: "page",
    values: [
      { name: "page", value: themeTokens.colors.background.page },
      { name: "surface", value: themeTokens.colors.background.DEFAULT },
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

const Providers = ({ children }: PropsWithChildren) => (
  <Tooltip.Provider>
    <Toaster />
    <DialogProvider />
    {children}
  </Tooltip.Provider>
)

const preview: Preview = {
  tags: ["autodocs"],
  decorators: [
    Story => {
      useEffect(() => {
        glob`
          body {
            overflow: auto!important;
          }
        `
      }, [])
      return (
        <Providers>
          <Story />
        </Providers>
      )
    },
  ],
  parameters,
  argTypes: {
    asChild: argType.hidden(),
    className: argType.hidden(),
    children: argType.hidden(),
  },
}

export default preview
