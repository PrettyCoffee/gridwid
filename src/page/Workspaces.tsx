import { Circle } from "lucide-react"

import { IconButton } from "~/components/IconButton"
import { cn } from "~/lib/utils"

export const Workspaces = () => (
  <div
    className={cn(
      "[&:not(:hover,:focus-within)]:pl-2 [&:not(:hover,:focus-within)>*]:w-6 [&>*]:transition-all transition-all",
      "relative before:absolute before:-left-2 before:-bottom-2 before:-top-10 before:-right-20 before:rounded-se-full"
    )}
  >
    <IconButton
      icon={Circle}
      className="text-highlight-foreground [&>svg]:fill-highlight-foreground"
    />
    <IconButton icon={Circle} />
    <IconButton icon={Circle} />
  </div>
)
