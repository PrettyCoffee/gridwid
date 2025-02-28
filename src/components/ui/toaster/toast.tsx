import { useCallback, useEffect, useRef } from "react"

import { useAnimate } from "framer-motion"
import { keyframes } from "goober"
import { X } from "lucide-react"

import { Icon } from "components/ui/icon"
import { cn } from "utils/cn"
import { ease } from "utils/ease"
import { alertStyles, hstack, surface } from "utils/styles"

import { ToastProps } from "./toaster-data"
import { IconButton } from "../icon-button/icon-button"

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

const noSize = { height: 0, width: 0, padding: 0, margin: 0, border: "none" }
const swipeOut = (element: HTMLDivElement) => ({
  opacity: 0,
  transform: "translateX(100%)",
  height: element.offsetHeight,
})

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

  const exit = useCallback(async () => {
    clearTimeout(timeout.current)

    await animate(scope.current, swipeOut(scope.current), {
      duration: 0.15,
      ease: ease.in,
    })
    await animate(scope.current, noSize, {
      duration: 0.2,
      ease: ease.bounce,
    })

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
        <div className="text-text-priority truncate">{title}</div>
        {message && (
          <div className="text-text ease- mt-1 line-clamp-3 text-sm">
            {message}
          </div>
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
