import { PropsWithChildren } from "react"

import { Stack } from "./base/Stack"

const Section = ({ children }: PropsWithChildren) => (
  <Stack
    direction="horizontal"
    justify="center"
    items="center"
    className="flex-1 first-of-type:justify-start last-of-type:justify-end whitespace-nowrap"
  >
    {children}
  </Stack>
)

const Root = ({ children }: PropsWithChildren) => (
  <Stack
    direction="horizontal"
    items="center"
    className="w-full min-w-max px-1 h-12 bg-background border-t mt-1"
  >
    {children}
  </Stack>
)

Root.displayName = "TaskBar.Root"
Section.displayName = "TaskBar.Section"
export const TaskBar = {
  Root,
  Section,
}
