import { useEffect, useRef, useState } from "react"

import { faker } from "@faker-js/faker"
import { Bell } from "lucide-react"

import { AlertBadge } from "components/ui/alert-badge"
import { Button } from "components/ui/button"
import { Icon } from "components/ui/icon"
import { showToast, toastList, ToastProps } from "components/ui/toaster"
import { useAtomValue } from "lib/yaasl"
import { AlertKind } from "types/base-props"
import { formatDate, formatTime } from "utils/format"

const Clock = () => {
  const [date, setDate] = useState(new Date())
  const interval = useRef<number>(undefined)

  useEffect(() => {
    interval.current = window.setInterval(() => {
      setDate(new Date())
    }, 1000)

    return () => clearInterval(interval.current)
  }, [])

  const time = formatTime(date)
  const day = formatDate(date)

  return (
    <div>
      <div className="text-end text-xs">{time}</div>
      <div className="text-end text-xs text-text-gentle">{day}</div>
    </div>
  )
}

const alertPriority: AlertKind[] = ["error", "warn", "success", "info"]
const getStatusKind = (toasts: ToastProps[]) => {
  const status = new Set(toasts.map(toast => toast.kind))
  return alertPriority.find(kind => status.has(kind)) ?? null
}

const getRandomToast = () => {
  const kind = alertPriority[faker.number.int({ min: 0, max: 3 })] ?? "info"
  return {
    kind: kind,
    title: `${kind[0]?.toUpperCase() ?? ""}${kind.slice(1)}`,
    message: faker.lorem.sentences(1),
  }
}

export const Notifications = () => {
  const toasts = useAtomValue(toastList)
  const status = getStatusKind(toasts)

  return (
    <Button
      look="flat"
      className="gap-2 px-2"
      onClick={() => showToast(getRandomToast())}
    >
      <Clock />
      <Icon icon={Bell} size="sm" filled={!!status} />
      <AlertBadge kind={status} hidden={!status} />
    </Button>
  )
}
