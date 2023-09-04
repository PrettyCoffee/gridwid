import { LucideIcon } from "lucide-react"

import { Button } from "~/components/ui/button"
import { cn } from "~/lib/utils"

const pressEffect = cn(
  "after:block",
  "after:absolute",
  "after:inset-0",
  "after:bg-gradient-to-br",
  "after:from-transparent",
  "after:to-background/75",
  "after:opacity-0",
  "after:transition-opacity",
  "after:duration-75",
  "active:after:opacity-100"
)

export interface IconButtonProps {
  icon: LucideIcon
  title?: string
  onClick?: () => void
}

export const IconButton = ({ icon: Icon, title }: IconButtonProps) => (
  <Button
    title={title}
    variant="ghost"
    size="icon"
    className={cn("relative", pressEffect)}
  >
    <Icon absoluteStrokeWidth className="h-5" />
  </Button>
)
