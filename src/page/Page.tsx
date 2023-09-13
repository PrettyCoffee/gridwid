import { useEffect, useRef, useState } from "react"

import { Bell, Bird, Sticker, Flame, Banana, Ghost, X } from "lucide-react"

import { Grid, GridSize } from "~/components/Grid"
import { Icon } from "~/components/Icon"
import { IconButton } from "~/components/IconButton"
import { TaskBar } from "~/components/TaskBar"
import { Button } from "~/components/ui/button"
import { Calendar } from "~/components/ui/calendar"
import { Card } from "~/components/ui/card"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover"
import { Widget } from "~/components/Widget"
import { RepoWidget } from "~/widgets/RepoWidget"
import { TaskListWidget } from "~/widgets/TaskListWidget"

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

const Notifications = () => (
  <Popover>
    <PopoverTrigger asChild>
      <Button variant="ghost" className="px-2 gap-2">
        <Clock />
        <Icon icon={Bell} size="sm" />
      </Button>
    </PopoverTrigger>
    <PopoverContent
      align="end"
      className="w-max flex flex-col gap-1 p-0 -translate-y-1 bg-transparent border-none overflow-auto max-h-[calc(100vh-theme(height.12)-theme(height.2))]"
    >
      <Card className="flex gap-2 justify-between p-2">
        <Button variant="outline">Some</Button>
        <Button variant="destructive">Content</Button>
      </Card>
      <Card className="p-2">
        <IconButton icon={Bird} title="Birb" />
        <IconButton icon={Banana} title="BANANA" />
        <IconButton icon={Sticker} title="Sticker" />
        <IconButton icon={Flame} title="Flame" />
        <IconButton icon={Ghost} title="*BOOOH*" />
      </Card>
      <Card className="p-2">
        <Calendar />
      </Card>
    </PopoverContent>
  </Popover>
)

const ItemContent = () => (
  <Widget.Root>
    <Widget.Header title="Create project">
      <IconButton icon={X} title="Close" />
    </Widget.Header>
    <Widget.Content className="text-muted-foreground">
      Deploy your new project in one-click.
    </Widget.Content>
    <Widget.Content expand>Bli bla blub</Widget.Content>
    <Widget.Content className="flex justify-between">
      <Button variant="outline">Cancel</Button>
      <Button>Deploy</Button>
    </Widget.Content>
  </Widget.Root>
)

const items: (GridSize & { id: number })[] = [
  { id: 1, columns: 3, rows: 3 },
  { id: 2, columns: 3, rows: 4 },
  { id: 3, columns: 1, rows: 1 },
  { id: 4, columns: 3, rows: 2 },
  { id: 5, columns: 1, rows: 1 },
  { id: 6, columns: 2, rows: 2 },
  { id: 7, columns: 3, rows: 2 },
]

export const Page = () => (
  <div className="flex flex-col h-full">
    <Grid.Root className="p-2 flex-1 overflow-y-auto">
      <Grid.Item columns={4} rows={5}>
        <TaskListWidget id="123456" title="Gridwid Tasks" />
      </Grid.Item>
      <Grid.Item columns={4} rows={5}>
        <RepoWidget owner="prettycoffee" name="yet-another-generic-startpage" />
      </Grid.Item>
      <Grid.Item columns={4} rows={5}>
        <RepoWidget owner="shadcn" name="ui" />
      </Grid.Item>
      {items.map(({ id, ...size }) => (
        <Grid.Item key={id} {...size}>
          <ItemContent />
        </Grid.Item>
      ))}
    </Grid.Root>
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
