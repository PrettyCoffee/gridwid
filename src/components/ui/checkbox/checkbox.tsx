import { Dispatch, ReactNode } from "react"

import * as Primitive from "@radix-ui/react-checkbox"
import { css, keyframes } from "goober"
import { Check, Minus } from "lucide-react"

import { useRenderState } from "hooks/use-render-state"
import { ClassNameProp } from "types/base-props"
import { cn } from "utils/cn"
import { hstack, interactive, vstack } from "utils/styles"

import { AutoAnimateHeight } from "../../utility/auto-animate-height"
import { Divider } from "../divider"
import { Icon } from "../icon"

const CheckboxLabel = ({
  checked,
  label,
  subLine,
}: Pick<CheckboxProps, "checked" | "label" | "subLine">) => {
  const isChecked = checked === true

  return (
    <AutoAnimateHeight duration={150} className={cn("my-0.5")}>
      <div className={cn(vstack({}), isChecked && "h-5")}>
        <div
          className={cn(
            "relative w-full shrink-0 text-start text-sm",
            isChecked ? "text-text-gentle line-clamp-1" : "line-clamp-3"
          )}
        >
          <span
            className={cn(
              "bg-text-gentle absolute top-2.5 h-0.5 w-full rounded-sm",
              "origin-left scale-x-0 transition-transform duration-300 ease-out",
              isChecked && "scale-x-100 delay-150"
            )}
          />
          {label}
        </div>

        {!isChecked && subLine && (
          <>
            <Divider color="gentle" className="my-0.5" />
            <div className={"text-text-gentle text-xs"}>{subLine}</div>
          </>
        )}
      </div>
    </AutoAnimateHeight>
  )
}

const wiggle = keyframes`
  0% {
      rotate: 0deg;
      scale: 0;
  }
  25% {
      rotate: 10deg;
  }
  50% {
    rotate: -10deg;
    scale: 1;
  }
  75% {
      rotate: 10deg;
  }
  100% {
    rotate: 0deg;
  }
`

const checkAnimation = css`
  animation: 500ms ${wiggle} ease-in-out;
`

export interface CheckboxProps extends ClassNameProp {
  /** Checked state of the checkbox */
  checked: Primitive.CheckedState
  /** Handler top be called when clicking the checkbox */
  onChange: Dispatch<Primitive.CheckedState>
  /** Label of the checkbox */
  label?: ReactNode
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
  const renderState = useRenderState()

  return (
    <Primitive.Root
      {...delegated}
      checked={checked}
      onCheckedChange={onChange}
      className={cn(
        hstack({ gap: 4, align: "center" }),
        interactive({ look: "flat" }),
        "rounded-md p-2",
        label ? "min-h-10 w-full pr-3" : "size-10",
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
            className={cn(
              checked === true &&
                renderState.current === "didMount" &&
                checkAnimation
            )}
          />
        </Primitive.Indicator>
      </div>

      {label && (
        <CheckboxLabel checked={checked} label={label} subLine={subLine} />
      )}
    </Primitive.Root>
  )
}
