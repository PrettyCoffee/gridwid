import { PropsWithChildren, useEffect, useRef, useState } from "react"

import { Slot } from "@radix-ui/react-slot"
import { motion } from "motion/react"

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
  const contentRef = useRef<HTMLElement | null>(null)
  const [height, setHeight] = useState<number | "auto">("auto")

  useEffect(() => {
    if (!contentRef.current) return

    const resizeObserver = new ResizeObserver(entries => {
      // @ts-expect-error -- keep observedHeight for now
      // eslint-disable-next-line unused-imports/no-unused-vars -- keep observedHeight for now
      const observedHeight = entries[0]?.contentRect.height ?? 0

      const styles = window.getComputedStyle(contentRef.current!)
      setHeight(Number.parseInt(styles.height))
    })

    resizeObserver.observe(contentRef.current)

    return () => resizeObserver.disconnect()
  }, [])

  return (
    <motion.div
      className={cn(className, "overflow-hidden")}
      style={{ height }}
      animate={{ height }}
      transition={{ duration: duration / 1000, delay }}
    >
      <Slot ref={contentRef}>{children}</Slot>
    </motion.div>
  )
}
