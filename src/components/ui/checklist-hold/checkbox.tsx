import { ChangeEvent, Dispatch, ForwardedRef, KeyboardEvent } from "react"

import * as Primitive from "@radix-ui/react-checkbox"
import { css, keyframes } from "goober"
import { Check, Minus } from "lucide-react"

import { useRenderState } from "hooks/use-render-state"
import { ClassNameProp } from "types/base-props"
import { cn } from "utils/cn"
import { hstack, interactive } from "utils/styles"

import { AutoAnimateHeight } from "../../utility/auto-animate-height"
import { Icon } from "../icon"
import { useLongClick } from "./use-long-click"

const CheckboxLabel = ({
  checked,
  label,
}: Pick<CheckboxProps, "checked" | "label">) => {
  const isChecked = checked === true

  return (
    <AutoAnimateHeight duration={150} className={cn("my-0.5")}>
      <div
        className={cn(
          "relative w-full shrink-0 text-start text-sm",
          isChecked ? "text-text-gentle line-clamp-1 h-5" : "line-clamp-3"
        )}
      >
        <span
          className={cn(
            "absolute top-2.5 h-0.5 w-full rounded-sm bg-text-gentle",
            "origin-left scale-x-0 transition-transform duration-300 ease-out",
            isChecked && "scale-x-100 delay-150"
          )}
        />
        {label}
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

const CheckIndicator = ({ checked }: { checked: Primitive.CheckedState }) => {
  const renderState = useRenderState()
  return (
    <div
      className={cn(
        hstack({ align: "center", justify: "center", inline: true }),
        "size-6 shrink-0 rounded-sm border border-stroke/50 shade-low [:hover>&]:border-stroke"
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
  )
}

export interface CheckboxProps extends ClassNameProp {
  /** Label of the checkbox */
  label?: string
  /** Checked state of the checkbox */
  checked: Primitive.CheckedState
  /** Handler top be called when clicking the checkbox */
  onCheckedChange: Dispatch<boolean>
  /** Handler to be called when clicking the checkbox two times */
  onLongClick?: () => void
}

export const Checkbox = ({
  checked,
  onCheckedChange,
  label,
  className,
  onLongClick,
  ...delegated
}: CheckboxProps) => {
  const hasLabel = label != null

  const clickEvents = useLongClick({
    onClick: () => onCheckedChange(!checked),
    onLongClick: () => onLongClick?.(),
  })

  return (
    <Primitive.Root
      {...delegated}
      {...clickEvents}
      checked={checked}
      className={cn(
        hstack({ gap: 4, align: "center" }),
        interactive({ look: "flat" }),
        "rounded-md p-2",
        hasLabel ? "min-h-10 w-full pr-3" : "size-10",
        className
      )}
    >
      <CheckIndicator checked={checked} />
      {hasLabel && <CheckboxLabel checked={checked} label={label} />}
    </Primitive.Root>
  )
}

const textAreaStyles = css`
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  -webkit-text-fill-color: transparent;

  &::placeholder {
    -webkit-text-fill-color: initial;
  }
`

const labelStyles = cn(
  "py-2.5 pr-3 pl-2 text-sm wrap-anywhere whitespace-pre-wrap"
)

interface CheckboxEditorProps extends Omit<CheckboxProps, "onDoubleClick"> {
  /** Placeholder to be displayed if label "is empty */
  placeholder: string
  /** Handler to be called when label is changed */
  onLabelChange: Dispatch<string>
  /** Handler to be called when the input is focused */
  onFocus?: () => void
  /** Handler to be called when the input looses focus */
  onBlur?: () => void
  /** Provides access to the rendered html node */
  textInputRef?: ForwardedRef<HTMLTextAreaElement>
  onEnterDown?: () => void
}
export const CheckboxEditor = ({
  checked,
  onCheckedChange,
  label,
  onLabelChange,
  onEnterDown,
  placeholder,
  className,
  textInputRef,
  ...inputProps
}: CheckboxEditorProps) => {
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault()
      onEnterDown?.()
      return
    }
  }

  const handleLabelChange = ({ target }: ChangeEvent<HTMLTextAreaElement>) => {
    onLabelChange(target.value)
  }

  return (
    <div
      className={cn(
        hstack({ align: "center", justify: "stretch" }),
        "rounded-md border border-stroke-gentle has-[textarea:focus-visible]:border-stroke-focus has-[textarea:hover:not(:focus-visible)]:border-stroke",
        "*:-my-px first:-ml-px last:-mr-px",
        className
      )}
    >
      <Primitive.Root
        checked={checked}
        onCheckedChange={onCheckedChange}
        className={cn(
          interactive({ look: "flat" }),
          "size-10 rounded-md p-2",
          className
        )}
      >
        <CheckIndicator checked={checked} />
      </Primitive.Root>

      <div className="max-h-20 flex-1 overflow-y-auto" tabIndex={-1}>
        <div className="relative">
          <textarea
            ref={textInputRef}
            {...inputProps}
            value={label}
            placeholder={placeholder}
            onChange={handleLabelChange}
            onKeyDown={handleKeyDown}
            className={cn(
              "absolute inset-0 size-full resize-none outline-none",
              labelStyles,
              textAreaStyles
            )}
          />
          <div
            aria-hidden
            className={cn(
              "overflow-hidden",
              labelStyles,
              !label && "text-text-gentle"
            )}
          >
            {label || placeholder}
          </div>
        </div>
      </div>
    </div>
  )
}
