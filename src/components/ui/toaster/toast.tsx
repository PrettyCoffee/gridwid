import { useCallback, useEffect, useRef } from "react"

import { keyframes } from "goober"
import { X } from "lucide-react"
import { AnimationSequence } from "motion"
import { useAnimate } from "motion/react"

import { Icon } from "components/ui/icon"
import { cn } from "utils/cn"
import { ease } from "utils/ease"
import { alertStyles, hstack, surface } from "utils/styles"

import { ToastProps } from "./toaster-data"
import { IconButton } from "../icon-button"

interface ExtendedToastProps extends ToastProps {
  onClose: (id: string) => void
}

const shrinkTimeBar = keyframes`
  0% {
    left: 0.5rem;
    right: 0.5rem;
    bottom: 0.125rem;
  }
  100% {
    left: 100%;
    right: 0.5rem;
    bottom: 0.125rem;
  }
`

const enterAnimation = (element: HTMLElement): AnimationSequence => [
  [element, { opacity: 0, scale: 0 }, { duration: 0, type: "spring" }],
  [
    element,
    { opacity: 1, scale: 1 },
    { duration: 0.2, type: "spring", bounce: 0.25 },
  ],
]

const exitAnimation = (element: HTMLElement): AnimationSequence => {
  const noSize = { height: 0, width: 0, padding: 0, margin: 0, border: "none" }
  const swipeOut = { opacity: 0, transform: "translateX(100%)" }

  return [
    [element, swipeOut, { duration: 0.2, ease: ease.in }],
    [element, noSize, { at: 0.15, duration: 0.15, ease: ease.bounce }],
  ]
}

export const Toast = ({
  id,
  kind,
  title,
  message,
  duration,
  onClose,
}: ExtendedToastProps) => {
  const [scope, animate] = useAnimate<HTMLDivElement>()
  const timeout = useRef<Timer | undefined>(undefined)

  useEffect(() => {
    animate(enterAnimation(scope.current))
  }, [animate, scope])

  const exit = useCallback(async () => {
    clearTimeout(timeout.current)
    await animate(exitAnimation(scope.current))
    onClose(id)
  }, [animate, id, onClose, scope])

  useEffect(() => {
    if (duration) {
      timeout.current = setTimeout(() => void exit(), duration)
    }
    return () => clearTimeout(timeout.current)
  }, [duration, exit])

  return (
    <div
      ref={scope}
      className={cn(
        hstack(),
        surface({ look: "overlay", size: "md" }),
        "relative my-1 w-72 overflow-hidden border-2 p-1",
        alertStyles[kind].borderGentle
      )}
    >
      <div
        className={cn(
          hstack({ align: "center", justify: "center" }),
          "size-10"
        )}
      >
        <Icon icon={alertStyles[kind].icon} color={kind} size="lg" />
      </div>
      <div className="my-2 flex-1 overflow-hidden">
        <div className="truncate text-text-priority">{title}</div>
        {message && (
          <div className="mt-1 line-clamp-3 text-sm text-text">{message}</div>
        )}
      </div>
      <IconButton
        icon={X}
        title="Close toast"
        look="flat"
        onClick={() => void exit()}
      />
      <span
        className={cn("absolute h-0.5 rounded-sm", alertStyles[kind].bg)}
        style={{
          animation: `${shrinkTimeBar} ${duration ?? 0}ms linear forwards`,
        }}
      />
    </div>
  )
}
