import "../src/index.css"
import { PropsWithChildren, useEffect } from "react"

import type { Preview } from "@storybook/react-vite"
import { glob } from "goober"

import { customBlocks } from "./custom-blocks"
import { DialogProvider } from "../src/components/ui/dialog"
import { Toaster } from "../src/components/ui/toaster"
import { Tooltip } from "../src/components/ui/tooltip"
import { argType } from "../src/lib/storybook"
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
