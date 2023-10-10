import { PropsWithChildren, useEffect, useRef, useState } from "react"

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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover"
import { cn } from "~/lib/utils"
import { ImageWidget } from "~/widgets/image/ImageWidget"
import { LinkTreeWidget } from "~/widgets/link-tree/LinkTreeWidget"
import { RepoWidget } from "~/widgets/repo/RepoWidget"
import { TaskListWidget } from "~/widgets/task-list/TaskListWidget"
import { WidgetConfig, WidgetConfigList } from "~/widgets/widgetConfig"

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
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="px-2 gap-2">
          <Clock />
          {status && (
            <>
              <Icon icon={Bell} size="sm" />
              <StatusIndicator kind={status} />
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
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
        <Card className="p-2 shadow-md">
          <Calendar />
        </Card>
      </PopoverContent>
    </Popover>
  )
}

const ScrollArea = ({ children }: PropsWithChildren) => (
  <div className="flex-1 overflow-auto p-2">{children}</div>
)

const repoWidgets: WidgetConfigList = [
  {
    size: { columns: 4, rows: 4 },
    component: RepoWidget,
    props: {
      id: "repo-1",
      owner: "prettycoffee",
      name: "yet-another-generic-startpage",
    },
  },
  {
    component: RepoWidget,
    size: { columns: 4, rows: 4 },
    props: { id: "repo-2", owner: "prettycoffee", name: "gridwid" },
  },
  {
    component: RepoWidget,
    size: { columns: 3, rows: 3 },
    props: { id: "repo-3", owner: "shadcn", name: "ui" },
  },
  {
    size: { columns: 3, rows: 2 },
    component: ImageWidget,
    props: {
      id: "image-1",
      src: "https://i.pinimg.com/originals/fc/35/f2/fc35f21075cc1500fababbbbf501c2e1.gif",
    },
  },
  {
    size: { columns: 3, rows: 2 },
    component: ImageWidget,
    props: {
      id: "image-2",
      src: "https://media.tenor.com/GjegbNUod5gAAAAC/duck-cute.gif",
    },
  },
]

const mainWidgets: WidgetConfigList = [
  {
    size: { columns: 3, rows: 4 },
    component: LinkTreeWidget,
    props: { id: "link-tree-1", title: "Bookmarks" },
  },
  {
    size: { columns: 3, rows: 4 },
    component: TaskListWidget,
    props: { id: "1" },
  },
  {
    size: { columns: 5, rows: 6 },
    component: TaskListWidget,
    props: { id: "2", title: "Gridwid Tasks" },
  },
  {
    size: { columns: 3, rows: 2 },
    component: ImageWidget,
    props: {
      id: "image-3",
      src: "https://i.pinimg.com/originals/10/e6/ef/10e6ef76794e3c11425387a2ee140f2c.gif",
    },
  },
  {
    size: { columns: 3, rows: 2 },
    component: ImageWidget,
    props: {
      id: "image-4",
      src: "https://64.media.tumblr.com/54a945edd2641e20859d6f6537cd7423/tumblr_pwa4bogz4N1qze3hdo2_r1_500.gifv",
    },
  },
]

const WidgetList = ({ widgets }: { widgets: WidgetConfigList }) =>
  (widgets as unknown as WidgetConfig[]).map(
    ({ size, props, component: Component }) => (
      <Grid.Item key={props.id} {...size}>
        <Component {...props} />
      </Grid.Item>
    )
  )

export const Page = () => (
  <div className="flex flex-col h-full">
    <ScrollArea>
      <Grid.Root>
        <WidgetList widgets={mainWidgets} />
      </Grid.Root>
      <Section title="Repositories" className="mt-4 [&>:first-of-type]:px-2">
        <Grid.Root>
          <WidgetList widgets={repoWidgets} />
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
