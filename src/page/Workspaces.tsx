import { Circle, KanbanSquare } from "lucide-react"

import { IconButton } from "~/components/IconButton"
import { cn } from "~/lib/utils"

export const Workspaces = () => (
  <div
    className={cn(
      "[&>*]:transition-all transition-all [&:not(:hover,:focus-within)]:pl-2 [&:not(:hover,:focus-within)>*]:w-6 [&:not(:hover,:focus-within)>*]:min-w-0",
      "relative before:absolute before:-left-1 before:-bottom-0.5 before:-top-10 before:-right-20 before:rounded-se-full"
    )}
  >
    <IconButton
      icon={Circle}
      title="Productivity"
      className="text-accent [&>svg]:fill-accent"
    />
    <IconButton icon={Circle} title="Work" />
    <IconButton icon={KanbanSquare} title="Task board" />
  </div>
)
