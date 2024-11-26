import * as Primitive from "@radix-ui/react-checkbox"
import { Check, Minus } from "lucide-react"
import { Dispatch, ReactNode } from "react"

import { ClassNameProp } from "../../../types/base-props"
import { cn } from "../../../utils/cn"
import { hstack, interactive, vstack } from "../../../utils/styles"
import { Divider } from "../divider"
import { Icon } from "../icon"

export interface CheckboxProps extends ClassNameProp {
  /** Checked state of the checkbox */
  checked: Primitive.CheckedState
  /** Handler top be called when clicking the checkbox */
  onChange: Dispatch<Primitive.CheckedState>
  /** Label of the checkbox */
  label: ReactNode
  /** Additional information */
  subLine?: ReactNode
}
export const Checkbox = ({
  checked,
  onChange,
  label,
  subLine,
  className,
  ...delegated
}: CheckboxProps) => {
  const isChecked = checked === true
  return (
    <Primitive.Root
      {...delegated}
      checked={checked}
      onCheckedChange={onChange}
      className={cn(
        hstack({ gap: 4, align: "center" }),
        interactive({ look: "flat" }),
        "min-h-10 rounded-md p-2 pr-3",
        className
      )}
    >
      <div
        className={cn(
          hstack({ align: "center", justify: "center", inline: true }),
          "shade-low border-stroke/50 [:hover>&]:border-stroke size-6 shrink-0 rounded-sm border"
        )}
      >
        <Primitive.Indicator asChild>
          <Icon
            icon={checked === "indeterminate" ? Minus : Check}
            size="xs"
            strokeWidth={4}
            color={checked === "indeterminate" ? "gentle" : "success"}
          />
        </Primitive.Indicator>
      </div>
      <div className={cn(vstack({}))}>
        <div
          className={cn(
            "text-start text-sm",
            isChecked &&
              "decoration-text-gentle text-text-gentle truncate line-through decoration-2"
          )}
        >
          {label}
        </div>
        {subLine && !isChecked && (
          <>
            <Divider color="gentle" className="my-0.5" />
            <div className="text-text-gentle text-xs">{subLine}</div>
          </>
        )}
      </div>
    </Primitive.Root>
  )
}
