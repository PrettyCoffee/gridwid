import "../src/index.css"
import { PropsWithChildren, useEffect } from "react"

import type { Preview } from "@storybook/react-vite"
import { glob } from "goober"

import { DialogProvider } from "components/ui/dialog"
import { Toaster } from "components/ui/toaster"
import { Tooltip } from "components/ui/tooltip"
import { argType } from "lib/storybook"

import { customBlocks } from "./custom-blocks"
import { theme } from "../tailwind/theme"

const { color } = theme.variants["dark"] ?? theme.defaultTokens

const parameters: Preview["parameters"] = {
  docs: { ...customBlocks },
  actions: { argTypesRegex: "^on[A-Z].*" },
  backgrounds: {
    options: [
      { name: "page", value: color.background.page },
      { name: "surface", value: color.background.default },
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
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
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
