import { keyframes } from "goober"
import {
  BadgeAlert,
  BadgeCheck,
  BadgeInfo,
  BadgeX,
  LucideIcon,
  X,
} from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"

import { Icon } from "components/ui/icon"
import { AlertKind } from "types/base-props"
import { cn } from "utils/cn"
import { hstack } from "utils/styles"

import { ToastProps } from "./toaster-data"
import { IconButton } from "../icon-button/icon-button"

const icon: Record<AlertKind, LucideIcon> = {
  info: BadgeInfo,
  success: BadgeCheck,
  warn: BadgeAlert,
  error: BadgeX,
}

const border: Record<AlertKind, string> = {
  info: "border-alert-info/25",
  success: "border-alert-success/25",
  warn: "border-alert-warn/25",
  error: "border-alert-error/25",
}

const barColor: Record<AlertKind, string> = {
  error: "bg-alert-error",
  warn: "bg-alert-warn",
  success: "bg-alert-success",
  info: "bg-alert-info",
}

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

enum TRANSITION {
  IDLE,
  SWIPE,
  SHRINK,
}

const noSize = { height: 0, width: 0, padding: 0, margin: 0, border: "none" }
const swipeOut = cn("translate-x-full opacity-0 transition-all")
const getTransition = (ref: HTMLDivElement | null, state: TRANSITION) => {
  switch (state) {
    case TRANSITION.IDLE:
      return {}
    case TRANSITION.SWIPE:
      return {
        className: cn(swipeOut, "duration-150 ease-in"),
        style: { height: ref?.offsetHeight },
      }
    case TRANSITION.SHRINK:
      return {
        className: cn(swipeOut, "ease-bounce duration-200"),
        style: noSize,
      }
  }
}

export const Toast = ({
  id,
  kind,
  title,
  message,
  duration,
  onClose,
}: ExtendedToastProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const timeout = useRef<Timer | undefined>(undefined)
  const [transitionState, setTransitionState] = useState(TRANSITION.IDLE)

  const handleTransitionEnd = () => {
    const next = {
      [TRANSITION.IDLE]: () => null,
      [TRANSITION.SWIPE]: () => setTransitionState(TRANSITION.SHRINK),
      [TRANSITION.SHRINK]: () => onClose(id),
    }
    next[transitionState]()
  }

  const startClose = useCallback(() => {
    clearTimeout(timeout.current)
    setTransitionState(TRANSITION.SWIPE)
  }, [])

  useEffect(() => {
    if (duration) {
      timeout.current = setTimeout(startClose, duration)
    }
    return () => clearTimeout(timeout.current)
  }, [duration, startClose])

  const transition = getTransition(ref.current, transitionState)

  return (
    <div
      ref={ref}
      onTransitionEnd={handleTransitionEnd}
      className={cn(
        hstack(),
        "text-text shade-low bgl-base-b/75 relative my-1 w-72 overflow-hidden rounded-md border-2 p-1 backdrop-blur-md",
        border[kind],
        transition.className
      )}
      style={transition.style}
    >
      <div
        className={cn(
          hstack({ align: "center", justify: "center" }),
          "size-10"
        )}
      >
        <Icon icon={icon[kind]} color={kind} size="lg" />
      </div>
      <div className="my-2 flex-1 overflow-hidden">
        <div className="text-text-priority truncate">{title}</div>
        {message && (
          <div className="text-text mt-1 line-clamp-3 text-sm">{message}</div>
        )}
      </div>
      <IconButton
        icon={X}
        title="Close toast"
        look="flat"
        onClick={startClose}
      />
      <span
        className={cn("absolute h-0.5 rounded", barColor[kind])}
        style={{
          animation: `${shrinkTimeBar} ${duration ?? 0}ms linear forwards`,
        }}
      />
    </div>
  )
}
