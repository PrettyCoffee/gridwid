import { PropsWithChildren } from "react"

const Section = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex-1 flex items-center justify-center first-of-type:justify-start last-of-type:justify-end">
      {children}
    </div>
  )
}

const Root = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex items-center px-1 h-12 bg-background border-t mt-1">
      {children}
    </div>
  )
}

Root.displayName = "TaskBar.Root"
Section.displayName = "TaskBar.Section"
export const TaskBar = {
  Root,
  Section,
}
