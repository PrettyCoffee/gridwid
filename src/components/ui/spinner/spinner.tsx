import { VariantProps, cva } from "class-variance-authority"
import { css, keyframes } from "goober"
import { useEffect, useState } from "react"

import { ClassNameProp } from "types/base-props"
import { cn } from "utils/cn"

const strokeOffset = keyframes`
  0% { stroke-dasharray: 0 150; stroke-dashoffset: 0; }
  47.5% { stroke-dasharray: 42 150; stroke-dashoffset: -16; }
  95%,100% { stroke-dasharray: 42 150; stroke-dashoffset: -59; }
`

const circle = css`
  animation: ${strokeOffset} 2s ease-in-out infinite;
`

const sizes = {
  sm: "size-4",
  md: "size-8",
  lg: "size-16",
  xl: "size-24",
}

const spinner = cva("", {
  variants: {
    color: {
      default: "stroke-text",
      current: "stroke-current",
      surface: "stroke-text-surface",
    },
    size: sizes,
  },
  defaultVariants: {
    color: "default",
    size: "md",
  },
})

interface SpinnerProps extends ClassNameProp, VariantProps<typeof spinner> {
  centered?: boolean
}

export const Spinner = ({ size, color, centered, className }: SpinnerProps) => {
  const [defer, setDefer] = useState(true)

  useEffect(() => {
    if (!defer) return
    setTimeout(() => setDefer(false), 200)
  }, [defer])

  return (
    <div
      className={cn(
        "inline-flex place-content-center",
        centered ? "size-full" : sizes[size ?? "md"],
        className
      )}
    >
      {defer ? null : (
        <svg
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          className={cn(spinner({ size, color }))}
        >
          <g className="origin-center animate-spin duration-1000">
            <circle
              className={cn(circle)}
              cx="12"
              cy="12"
              r="9.5"
              fill="none"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </g>
        </svg>
      )}
    </div>
  )
}
