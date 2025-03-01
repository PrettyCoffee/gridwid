import { Dispatch, HTMLProps } from "react"

import { Search, X } from "lucide-react"

import { Icon } from "components/ui/icon"
import {
  AlertKind,
  ClassNameProp,
  DisableProp,
  RefProp,
} from "types/base-props"
import { cn } from "utils/cn"
import { alertStyles, focusRing, hstack } from "utils/styles"

import { IconButton } from "../icon-button"
import { TitleTooltip } from "../tooltip"

type InputProps = HTMLProps<HTMLInputElement>

export interface TextInputProps
  extends RefProp<HTMLInputElement>,
    ClassNameProp,
    DisableProp,
    Pick<InputProps, "placeholder"> {
  type?: "text" | "search"
  value?: string
  alert?: { kind: AlertKind; text: string }

  onChange?: Dispatch<string>
  onKeyDown?: Dispatch<string>
  onFocus?: () => void
  onBlur?: () => void
}

export const TextInput = ({
  ref,
  alert,
  onChange,
  onKeyDown,
  className,
  type = "text",
  ...props
}: TextInputProps) => {
  const isSearch = type === "search"

  return (
    <div
      className={cn(
        hstack({ inline: true, align: "center", justify: "center" }),
        "bg-background-page border-stroke-gentle relative w-full rounded-md border",
        alert && alertStyles[alert.kind].border,
        focusRing,
        className
      )}
    >
      {isSearch && (
        <span className="grid h-full shrink-0 place-content-center pl-3">
          <Icon icon={Search} size="sm" />
        </span>
      )}

      <input
        ref={ref}
        {...props}
        type={type}
        onChange={({ currentTarget }) => onChange?.(currentTarget.value)}
        onKeyDown={({ key }) => onKeyDown?.(key)}
        className={cn(
          "placeholder:text-text-gentle text-text h-10 w-full flex-1 bg-transparent px-3 text-sm outline-none",
          (isSearch || alert) && "pr-0"
        )}
      />

      {alert && (
        <TitleTooltip title={alert.text} side="right" asChild>
          <span className="grid size-10 shrink-0 place-content-center">
            <Icon
              icon={alertStyles[alert.kind].icon}
              color={alert.kind}
              size="sm"
            />
          </span>
        </TitleTooltip>
      )}

      {isSearch && !!props.value && (
        <IconButton
          hideTitle
          title="Clear text field"
          icon={X}
          onClick={() => onChange?.("")}
        />
      )}
    </div>
  )
}
