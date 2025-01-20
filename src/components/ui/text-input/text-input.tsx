import { Dispatch, forwardRef, HTMLProps } from "react"

import { Icon } from "components/ui/icon"
import { AlertKind, ClassNameProp, DisableProp } from "types/base-props"
import { cn } from "utils/cn"
import { alertStyles } from "utils/styles"

import { TitleTooltip } from "../tooltip"

type InputProps = HTMLProps<HTMLInputElement>

interface TextInputProps
  extends ClassNameProp,
    DisableProp,
    Pick<InputProps, "placeholder"> {
  value?: string
  alert?: { kind: AlertKind; text: string }

  onChange?: Dispatch<string>
  onKeyDown?: Dispatch<string>
  onFocus?: () => void
  onBlur?: () => void
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ alert, onChange, onKeyDown, className, ...props }, ref) => {
    return (
      <span className={cn("relative inline-block w-full", className)}>
        <input
          ref={ref}
          {...props}
          type="text"
          onChange={({ currentTarget }) => onChange?.(currentTarget.value)}
          onKeyDown={({ key }) => onKeyDown?.(key)}
          className={cn(
            "border-stroke-gentle bg-background-page placeholder:text-text-gentle text-text h-10 w-full rounded-sm border px-3 text-sm",
            alert && ["pr-10", alertStyles[alert.kind].border]
          )}
        />
        {alert && (
          <TitleTooltip title={alert.text} side="right" asChild>
            <span className="absolute inset-y-0 right-0 grid size-10 place-content-center">
              <Icon
                icon={alertStyles[alert.kind].icon}
                color={alert.kind}
                size="sm"
              />
            </span>
          </TitleTooltip>
        )}
      </span>
    )
  }
)
TextInput.displayName = "TextInput"
