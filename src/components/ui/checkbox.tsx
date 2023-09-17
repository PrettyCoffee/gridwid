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

const checkbox = cva(
  cn(
    "peer shrink-0 rounded-sm border border-primary disabled:cursor-not-allowed disabled:opacity-50",
    "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
  ),
  {
    variants: {
      compact: {
        true: "h-4 w-4",
        false: "h-6 w-6",
      },
    },
    defaultVariants: {
      compact: false,
    },
  }
)

type CheckboxProps = React.ComponentPropsWithoutRef<
  typeof CheckboxPrimitive.Root
> &
  VariantProps<typeof checkbox>

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, compact, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(checkbox({ compact }), className)}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current")}
    >
      <Icon icon={Check} color="current" size={compact ? "xs" : "md"} />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export interface CheckboxWithLabelProps
  extends ClassNameProp,
    VariantProps<typeof checkbox> {
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
  noWrap,
  compact,
}: CheckboxWithLabelProps) => (
  <label
    className={cn(
      "pr-1 flex cursor-pointer hover:bg-accent",
      compact ? "rounded-sm" : "rounded-md",
      press,
      noWrap && noOverflow,
      className
    )}
  >
    <Checkbox
      className={"m-2 relative before:absolute before:-inset-2"}
      checked={checked}
      onCheckedChange={() => onChange(!checked)}
      compact={compact}
    />
    <Text
      className={cn("pb-1 break-words", compact ? "pt-1.5" : "pt-2")}
      size={compact ? "sm" : "md"}
      color="current"
      noOverflow={noWrap}
    >
      {label}
    </Text>
  </label>
)

export { Checkbox, CheckboxWithLabel }
