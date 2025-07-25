import { Dispatch } from "react"

import * as Primitive from "@radix-ui/react-switch"

import { ClassNameProp } from "types/base-props"
import { cn } from "utils/cn"
import { hstack, interactive } from "utils/styles"

export interface ToggleProps extends ClassNameProp {
  label: string
  checked: boolean
  onChange: Dispatch<boolean>
}

export const Toggle = ({ checked, onChange, label }: ToggleProps) => (
  <label
    className={cn(
      hstack({ gap: 2, align: "center", inline: true }),
      interactive({ look: "flat" }),
      "h-10 cursor-pointer truncate rounded-l-lg rounded-r-md p-1 pr-3 text-start text-sm"
    )}
  >
    <Primitive.Root
      checked={checked}
      onCheckedChange={onChange}
      className={cn(
        "relative inline-block h-8 w-12 shrink-0 cursor-pointer rounded-xl",
        "bg-background-button/15 transition-[background-color] duration-100 ease-out",
        checked && "bg-highlight/50"
      )}
    >
      <Primitive.Thumb
        className={cn(
          "m-1 inline-block size-6 rounded-xl bg-background-button/75 transition-transform duration-100 ease-out",
          checked ? "translate-x-2" : "-translate-x-2"
        )}
      />
    </Primitive.Root>

    <span className="truncate">{label}</span>
  </label>
)
