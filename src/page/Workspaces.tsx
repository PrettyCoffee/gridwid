import { Circle } from "lucide-react"

import { IconButton } from "~/components/IconButton"
import { cn } from "~/lib/utils"

export const Workspaces = () => (
  <div
    className={cn(
      "[&:not(:hover,:focus-within)]:pl-2 [&:not(:hover,:focus-within)>*]:w-6 [&>*]:transition-all transition-all",
      "relative before:absolute before:-left-1 before:-bottom-0.5 before:-top-10 before:-right-20 before:rounded-se-full"
    )}
  >
    <IconButton
      icon={Circle}
      title="Productivity"
      className="text-highlight-foreground [&>svg]:fill-highlight-foreground"
    />
    <IconButton icon={Circle} title="Work" />
    <IconButton icon={Circle} title="Homework" />
  </div>
)
