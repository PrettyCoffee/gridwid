import { FC, PropsWithChildren, useEffect, useRef, useState } from "react"

import { Bell } from "lucide-react"
import { useAtomValue } from "yaasl/react"

import { AlertKind } from "~/components/AlertBanner"
import { Grid } from "~/components/Grid"
import { Icon } from "~/components/Icon"
import { Section } from "~/components/Section"
import { StatusIndicator } from "~/components/StatusIndicator"
import { TaskBar } from "~/components/TaskBar"
import { RenderedToast, ToastProps, toastList } from "~/components/Toast"
import { Button } from "~/components/ui/button"
import { Calendar } from "~/components/ui/calendar"
import { Card } from "~/components/ui/card"
import { Popover } from "~/components/ui/popover"
import { cn } from "~/lib/utils"
import { WidgetConfig, WidgetConfigList } from "~/widgets/widgetConfig"
import { widgets } from "~/widgets/widgets"

import { mainWidgets, repoWidgets } from "./demoWidgetList"
import { Menu } from "./Menu"
import { Workspaces } from "./Workspaces"

const Clock = () => {
  const [date, setDate] = useState(new Date())
  const interval = useRef<NodeJS.Timeout>()

  useEffect(() => {
    const clear = () => clearInterval(interval.current)
    if (interval.current) {
      clear()
    }

    interval.current = setInterval(() => {
      setDate(new Date())
    }, 1000)

    return clear
  }, [])

  const time = date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  })
  const day = date.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })

  return (
    <div>
      <div className="text-xs text-end">{time}</div>
      <div className="text-muted-foreground text-xs text-end">{day}</div>
    </div>
  )
}

const statusPriority: AlertKind[] = [
  "error",
  "warning",
  "success",
  "info",
  "neutral",
]
const getStatusKind = (toasts: ToastProps[]) => {
  const status = new Set(toasts.map(toast => toast.kind))
  return statusPriority.find(kind => status.has(kind)) ?? null
}

const Notifications = () => {
  const toasts = useAtomValue(toastList.atom)
  const status = getStatusKind(toasts)

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Button variant="ghost" className="px-2 gap-2">
          <Clock />
          {status && (
            <>
              <Icon icon={Bell} size="sm" />
              <StatusIndicator kind={status} />
            </>
          )}
        </Button>
      </Popover.Trigger>
      <Popover.Content
        align="end"
        className={cn(
          "w-max p-0 -translate-y-1 overflow-auto max-h-[calc(100vh-theme(height.12)-theme(height.2))] max-w-[calc(theme(width.64)+theme(width.2))]",
          "flex flex-col gap-1",
          "backdrop-blur-sm bg-transparent border-none shadow-none"
        )}
      >
        {toasts.map(toast => (
          <RenderedToast key={toast.id} {...toast} />
        ))}
        <Card.Root className="p-2 shadow-md">
          <Calendar />
        </Card.Root>
      </Popover.Content>
    </Popover.Root>
  )
}

const ScrollArea = ({ children }: PropsWithChildren) => (
  <div className="flex-1 overflow-auto p-2">{children}</div>
)

const WidgetList = ({ list }: { list: WidgetConfigList }) =>
  (list as unknown as WidgetConfig[]).map(({ size, props, widget }) => {
    const Component = widgets[widget].component as FC<typeof props>
    return (
      <Grid.Item key={props.id} {...size}>
        <Component {...props} />
      </Grid.Item>
    )
  })

export const Page = () => (
  <div className="flex flex-col h-full">
    <ScrollArea>
      <Grid.Root>
        <WidgetList list={mainWidgets} />
      </Grid.Root>
      <Section title="Repositories" className="mt-4 [&>:first-of-type]:px-2">
        <Grid.Root>
          <WidgetList list={repoWidgets} />
        </Grid.Root>
      </Section>
    </ScrollArea>
    <TaskBar.Root>
      <TaskBar.Section>
        <Workspaces />
      </TaskBar.Section>
      <TaskBar.Section>
        <Menu />
      </TaskBar.Section>
      <TaskBar.Section>
        <Notifications />
      </TaskBar.Section>
    </TaskBar.Root>
  </div>
)
