import {
  ChangeEvent,
  Dispatch,
  ForwardedRef,
  KeyboardEvent,
  useRef,
  useState,
} from "react"

import * as Primitive from "@radix-ui/react-checkbox"
import { css, keyframes } from "goober"
import { Check, Minus } from "lucide-react"

import { useRenderState } from "hooks/use-render-state"
import { ClassNameProp } from "types/base-props"
import { cn } from "utils/cn"
import { hstack, interactive } from "utils/styles"

import { AutoAnimateHeight } from "../../utility/auto-animate-height"
import { Icon } from "../icon"

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

const Label = ({
  checked,
  label,
}: Pick<CheckboxProps, "checked" | "label">) => {
  const isChecked = checked === true

  return (
    <AutoAnimateHeight duration={150} className={cn("my-0.5")}>
      <div
        className={cn(
          labelStyles,
          "relative w-max shrink-0 pr-1 text-start text-sm",
          isChecked ? "text-text-gentle line-clamp-1 h-5" : "line-clamp-3",
          "py-0"
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

interface LabelEditorProps {
  placeholder?: string
  label: string
  onLabelChange?: Dispatch<string>
  onEnterDown?: () => void
  textInputRef?: ForwardedRef<HTMLTextAreaElement>
  onBlur?: () => void
}
const LabelEditor = ({
  label,
  onEnterDown,
  onLabelChange,
  placeholder,
  textInputRef,
  onBlur,
}: LabelEditorProps) => {
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault()
      onEnterDown?.()
      return
    }
  }

  const handleLabelChange = ({ target }: ChangeEvent<HTMLTextAreaElement>) => {
    onLabelChange?.(target.value)
  }

  return (
    <div className="max-h-20 flex-1 overflow-y-auto" tabIndex={-1}>
      <div className="relative">
        <textarea
          ref={textInputRef}
          value={label}
          placeholder={placeholder}
          onChange={handleLabelChange}
          onKeyDown={handleKeyDown}
          onBlur={onBlur}
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
  )
}

interface CheckboxLabelProps {
  checked: Primitive.CheckedState
  placeholder?: string
  label: string
  onLabelChange?: Dispatch<string>
}
const CheckboxLabel = ({
  checked,
  placeholder,
  label,
  onLabelChange,
}: CheckboxLabelProps) => {
  const [editing, setEditing] = useState(false)
  const prevEditing = useRef(editing)

  const startEditing = () => setEditing(true)

  const stopEditing = () => {
    setEditing(false)
    prevEditing.current = false
  }

  return editing ? (
    <LabelEditor
      textInputRef={element => {
        if (!element) return

        if (!prevEditing.current) {
          element.focus()
          element.select()
          prevEditing.current = true
        }
      }}
      label={label}
      onLabelChange={onLabelChange}
      placeholder={placeholder}
      onBlur={stopEditing}
      onEnterDown={stopEditing}
    />
  ) : (
    <button
      onClick={startEditing}
      className={cn(interactive({ look: "flat" }), "flex-1 rounded-md")}
    >
      <Label checked={checked} label={label} />
    </button>
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
  label: string
  /** Checked state of the checkbox */
  checked: Primitive.CheckedState
  /** Handler top be called when clicking the checkbox */
  onCheckedChange: Dispatch<boolean>
  /** Handler to be called when label is changed */
  onLabelChange: Dispatch<string>
}

export const Checkbox = ({
  checked,
  onCheckedChange,
  onLabelChange,
  label,
  className,
  ...delegated
}: CheckboxProps) => (
  <div className={cn(hstack({}))}>
    <Primitive.Root
      {...delegated}
      checked={checked}
      onCheckedChange={onCheckedChange}
      className={cn(
        hstack({ gap: 4, align: "center" }),
        interactive({ look: "flat" }),
        "size-10 rounded-md p-2",
        className
      )}
    >
      <CheckIndicator checked={checked} />
    </Primitive.Root>
    <CheckboxLabel
      checked={checked}
      label={label}
      onLabelChange={onLabelChange}
    />
  </div>
)
