import {
  PropsWithChildren,
  RefObject,
  useEffect,
  useRef,
  useState,
} from "react"

import { motion } from "motion/react"

import { ClassNameProp } from "types/base-props"
import { cn } from "utils/cn"
import { createDebounce } from "utils/create-debounce"

const getContentHeight = (element: HTMLElement | null) => {
  if (!element) return { inPx: 0, inRem: 0 }

  const { paddingTop, paddingBottom } = window.getComputedStyle(element)
  const py = Number.parseFloat(paddingTop) + Number.parseFloat(paddingBottom)
  const height = element.scrollHeight + py

  return {
    inPx: height,
    inRem: height / 16,
  }
}

const useResizeObserver = (ref: RefObject<HTMLElement | null>) => {
  const [rect, setRect] = useState<DOMRectReadOnly | null>(null)
  const observer = useRef(
    new ResizeObserver(entries => {
      entries.forEach(({ contentRect }) => setRect(contentRect))
    })
  )

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const resizer = observer.current
    resizer.observe(element)
    return () => resizer.unobserve(element)
  }, [ref])

  return rect
}

const roundUp = (value: number) => {
  const floored = Math.floor(value)
  return floored === value ? floored : floored + 1
}

const useContentHeight = (maxHeight?: number) => {
  const ref = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState({ value: 0, hasOverflow: false })
  const { width } = useResizeObserver(ref) ?? {}

  useEffect(() => {
    const element = ref.current
    if (element) element.style.gridRowEnd = `span 1`

    const newHeight = roundUp(getContentHeight(element).inRem)
    const itemHeight = Math.min(newHeight, ...(maxHeight ? [maxHeight] : []))

    if (element) element.style.gridRowEnd = `span ${itemHeight}`

    setHeight({ value: itemHeight, hasOverflow: itemHeight !== newHeight })
  }, [maxHeight, width])

  return { ref, height }
}

interface MasonryItemProps extends ClassNameProp {
  maxHeight?: number
}

const Item = ({
  children,
  className,
  maxHeight,
  ...props
}: PropsWithChildren<MasonryItemProps>) => {
  const { ref, height } = useContentHeight(maxHeight)

  const [didInit, setDidInit] = useState(false)
  const debounce = useRef(createDebounce(100))
  useEffect(() => {
    // Ugly hack to hide masonry items initially, to ignore flickering and initial animations
    if (didInit || height.value === 0) return
    debounce.current(() => setDidInit(true))
  }, [didInit, height.value])

  // Skip initial layout animation
  const Div = !didInit ? "div" : motion.div

  return (
    <Div
      className={cn(
        "relative overflow-hidden",
        !didInit && "opacity-0",
        className
      )}
      layout="position"
      ref={ref}
      style={{ gridRowEnd: `span ${height.value}` }}
      transition={{
        type: "spring",
        damping: 5,
        mass: 0.15,
        stiffness: 80,
      }}
      {...props}
    >
      {children}
      {height.hasOverflow && (
        <div
          className={
            "from-background-page absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-15% to-transparent"
          }
        />
      )}
    </Div>
  )
}

interface MasonryGridProps extends ClassNameProp {
  minItemWidth: number
}

const Grid = ({
  minItemWidth,
  className,
  children,
}: PropsWithChildren<MasonryGridProps>) => (
  <div
    className={cn("grid auto-rows-[theme(height.4)]", className, "gap-0")}
    style={{
      gridTemplateColumns: `repeat(auto-fill, minmax(${minItemWidth}rem, 1fr))`,
    }}
  >
    {children}
  </div>
)

export const Masonry = { Grid, Item }
