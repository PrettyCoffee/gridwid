import { LucideIcon } from "lucide-react"

export type AlertKind = "info" | "success" | "warn" | "error"

export interface IconProp {
  /** Display an icon inside the component */
  icon?: LucideIcon
}

export interface ClassNameProp {
  /** Pass custom styles to the component */
  className?: string
}

export interface AsChildProp {
  /** Merge the component into the inner children without rendering an html element */
  asChild?: boolean
}

export interface DisableProp {
  /** Disable the component */
  disabled?: boolean
}
