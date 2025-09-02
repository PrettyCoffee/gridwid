import {
  TouchEvent as ReactTouchEvent,
  MouseEvent as ReactMouseEvent,
  useCallback,
  useRef,
  useState,
} from "react"

type LongClickEvent = ReactTouchEvent | ReactMouseEvent

const isTouchEvent = (event: unknown): event is ReactTouchEvent =>
  event instanceof TouchEvent

const preventDefault = (event: unknown) => {
  if (!isTouchEvent(event)) return

  if (event.touches.length < 2) event.preventDefault()
}

interface LongClickProps {
  onClick: () => void
  onLongClick: () => void
  delay?: number
  shouldPreventDefault?: boolean
}

export const useLongClick = ({
  onClick,
  onLongClick,
  delay = 300,
  shouldPreventDefault = true,
}: LongClickProps) => {
  const [longPressTriggered, setLongPressTriggered] = useState(false)
  const timeout = useRef<number>(null)
  const target = useRef<EventTarget>(null)

  const start = useCallback(
    (event: LongClickEvent) => {
      if (shouldPreventDefault) {
        event.target.addEventListener("touchend", preventDefault, {
          passive: false,
        })
        target.current = event.target
      }
      timeout.current = window.setTimeout(() => {
        onLongClick()
        setLongPressTriggered(true)
      }, delay)
    },
    [onLongClick, delay, shouldPreventDefault]
  )

  const clear = useCallback(
    (_event: LongClickEvent, shouldTriggerClick = true) => {
      if (timeout.current) window.clearTimeout(timeout.current)
      if (shouldTriggerClick && !longPressTriggered) onClick()
      setLongPressTriggered(false)
      if (shouldPreventDefault && target.current) {
        target.current.removeEventListener("touchend", preventDefault)
      }
    },
    [shouldPreventDefault, onClick, longPressTriggered]
  )

  return {
    onMouseDown: (e: ReactMouseEvent) => start(e),
    onTouchStart: (e: ReactTouchEvent) => start(e),
    onMouseUp: (e: ReactMouseEvent) => clear(e),
    onMouseLeave: (e: ReactMouseEvent) => clear(e, false),
    onTouchEnd: (e: ReactTouchEvent) => clear(e),
  }
}
