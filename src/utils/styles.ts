import { VariantProps, cva } from "class-variance-authority"

import { cn } from "./cn"

export const focusRing = cn(
  "outline-stroke-marked outline-2 outline-offset-2 focus-visible:outline [&:has(*:focus-visible)]:outline"
)

export const interactive = cva("", {
  variants: {
    look: {
      key: "bgl-base-background-surface text-text-surface hover:bgl-layer-b/10 active:bgl-layer-b/20",
      ghost:
        "text-text bgl-base-transparent border-input hover:bgl-layer-w/10 active:bgl-layer-w/15 border",
      flat: "text-text bgl-base-transparent hover:bgl-layer-w/10 active:bgl-layer-w/15",
      link: "text-text-priority underline-offset-4 hover:underline active:opacity-80",
      destructive:
        "bg-alert-error/10 border-alert-error text-alert-error hover:bg-alert-error/15 active:bg-alert-error/20 border",
    },
    active: {
      false: "",
    },
    disabled: {
      true: "pointer-events-none opacity-50",
    },
  },
  compoundVariants: [
    {
      active: true,
      disabled: false,
      look: ["ghost", "flat", "link"],
      className: "text-text-highlight border-text-highlight",
    },
  ],
  defaultVariants: {
    look: "flat",
    active: false,
    disabled: false,
  },
})
export type InteractiveProps = Omit<
  VariantProps<typeof interactive>,
  "disabled"
>

const stack = cva("", {
  variants: {
    inline: {
      true: "inline-flex",
      false: "flex",
    },
    wrap: {
      true: "flex-wrap",
      false: "flex-nowrap",
    },
    direction: {
      row: "flex-row",
      column: "flex-col",
    },
    align: {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      stretch: "items-stretch",
    },
    justify: {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
      around: "justify-around",
      evenly: "justify-evenly",
      stretch: "justify-stretch",
    },
    gap: {
      0: "gap-0",
      1: "gap-1",
      2: "gap-2",
      4: "gap-4",
      8: "gap-8",
    },
  },
  defaultVariants: {
    inline: false,
    align: "start",
    justify: "start",
    gap: 0,
    wrap: false,
  },
})

type StackProps = Omit<VariantProps<typeof stack>, "direction">

export const vstack = (props?: StackProps) =>
  stack({ direction: "column", ...props })

export const hstack = (props?: StackProps) =>
  stack({ direction: "row", ...props })
