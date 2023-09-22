import { PropsWithChildren } from "react"

import { HStack } from "./base/Stack"

const Section = ({ children }: PropsWithChildren) => (
  <HStack
    justify="center"
    items="center"
    className="flex-1 first-of-type:justify-start last-of-type:justify-end whitespace-nowrap"
  >
    {children}
  </HStack>
)

const Root = ({ children }: PropsWithChildren) => (
  <HStack
    items="center"
    className="w-full min-w-max px-1 h-12 bg-background border-t mt-1"
  >
    {children}
  </HStack>
)

Root.displayName = "TaskBar.Root"
Section.displayName = "TaskBar.Section"
export const TaskBar = {
  Root,
  Section,
}
