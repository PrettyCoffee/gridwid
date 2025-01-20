import { PropsWithChildren, useEffect, useRef, useState } from "react"

import { Slot } from "@radix-ui/react-slot"
import { motion } from "framer-motion"

import { ClassNameProp } from "types/base-props"
import { cn } from "utils/cn"

interface AnimateHeightProps extends ClassNameProp {
  duration?: number
  delay?: number
}
export const AutoAnimateHeight = ({
  children,
  duration = 0,
  delay,
  className,
}: PropsWithChildren<AnimateHeightProps>) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [height, setHeight] = useState<number | "auto">("auto")

  useEffect(() => {
    if (!containerRef.current) return

    const resizeObserver = new ResizeObserver(entries => {
      const observedHeight = entries[0]?.contentRect.height ?? 0
      setHeight(observedHeight)
    })

    resizeObserver.observe(containerRef.current)

    return () => resizeObserver.disconnect()
  }, [])

  return (
    <motion.div
      className={cn(className, "overflow-hidden")}
      style={{ height }}
      animate={{ height }}
      transition={{ duration: duration / 1000, delay }}
    >
      <Slot ref={containerRef}>{children}</Slot>
    </motion.div>
  )
}
