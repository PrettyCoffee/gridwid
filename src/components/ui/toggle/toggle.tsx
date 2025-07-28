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

const toggleTransition = cn(
  "transition-[translate,background-color] duration-200 ease-out"
)

export const Toggle = ({ checked, onChange, label }: ToggleProps) => (
  <label
    className={cn(
      hstack({ gap: 2, align: "center", inline: true }),
      interactive({ look: "flat" }),
      "h-10 cursor-pointer truncate rounded-l-lg rounded-r-md p-1 pr-3 pl-2 text-start text-sm"
    )}
  >
    <Primitive.Root
      checked={checked}
      onCheckedChange={onChange}
      className={cn(
        toggleTransition,
        "relative inline-block h-6 w-10 shrink-0 cursor-pointer rounded-xl bg-background-button/25",
        checked && "bg-highlight/50"
      )}
    >
      <Primitive.Thumb
        className={cn(
          toggleTransition,
          "m-0.5 inline-block size-5 rounded-xl bg-background-page/75",
          checked ? "translate-x-2" : "-translate-x-2"
        )}
      />
    </Primitive.Root>

    <span className="truncate">{label}</span>
  </label>
)
