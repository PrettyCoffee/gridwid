import * as React from "react"
import { Dispatch } from "react"

import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { cva, VariantProps } from "class-variance-authority"
import { Check } from "lucide-react"

import { noOverflow, press } from "~/lib/styles"
import { cn } from "~/lib/utils"

import { ClassNameProp } from "../base/BaseProps"
import { Icon } from "../Icon"
import { Text } from "../Text"

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      "data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current")}
    >
      <Icon
        icon={Check}
        size={"md"}
        color="current"
        className="h-3/4 w-h-3/4"
      />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

const withLabel = cva("m-2 relative before:absolute before:-inset-2", {
  variants: {
    size: {
      compact: "",
      default: "h-6 w-6",
    },
  },
  defaultVariants: {
    size: "default",
  },
})

export interface CheckboxWithLabelProps
  extends ClassNameProp,
    VariantProps<typeof withLabel> {
  label: string
  checked: boolean
  onChange: Dispatch<boolean>
  noWrap?: boolean
}
const CheckboxWithLabel = ({
  checked,
  label,
  onChange,
  className,
  size,
  noWrap,
}: CheckboxWithLabelProps) => (
  <label
    className={cn(
      "pr-1 flex cursor-pointer rounded hover:bg-accent",
      press,
      noWrap && noOverflow,
      className
    )}
  >
    <Checkbox
      className={cn(withLabel({ size }))}
      checked={checked}
      onCheckedChange={() => onChange(!checked)}
    />
    <Text
      className="pt-2 pb-1 break-words"
      size={size === "compact" ? "sm" : "md"}
      color="current"
      noOverflow={noWrap}
    >
      {label}
    </Text>
  </label>
)

export { Checkbox, CheckboxWithLabel }
