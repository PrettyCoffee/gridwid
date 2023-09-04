import { forwardRef } from "react"

import { LucideIcon } from "lucide-react"

import { Button } from "~/components/ui/button"

import { ClassNameProp } from "./base/BaseProps"

export interface IconButtonProps extends ClassNameProp {
  icon: LucideIcon
  title?: string
  onClick?: () => void
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon: Icon, className, ...delegated }, ref) => (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      className={className}
      {...delegated}
    >
      <Icon absoluteStrokeWidth className="h-5" />
    </Button>
  )
)
IconButton.displayName = "IconButton"
