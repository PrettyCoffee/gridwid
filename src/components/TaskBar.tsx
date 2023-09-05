import { PropsWithChildren, forwardRef } from "react"

const Section = forwardRef<HTMLDivElement, PropsWithChildren>(
  ({ children }, ref) => {
    return (
      <div
        ref={ref}
        className="flex-1 flex items-center justify-center first-of-type:justify-start last-of-type:justify-end whitespace-nowrap"
      >
        {children}
      </div>
    )
  }
)

const Root = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex items-center w-full min-w-max px-1 h-12 bg-background border-t mt-1">
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
