import { useEffect, useRef, useState } from "react"

import { Bell, Bird, Sticker, Flame, Banana, Ghost } from "lucide-react"

import { Grid } from "~/components/Grid"
import { Icon } from "~/components/Icon"
import { IconButton } from "~/components/IconButton"
import { StatusIndicator } from "~/components/StatusIndicator"
import { TaskBar } from "~/components/TaskBar"
import { Button } from "~/components/ui/button"
import { Calendar } from "~/components/ui/calendar"
import { Card } from "~/components/ui/card"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover"
import { ImageWidget } from "~/widgets/image/ImageWidget"
import { LinkTreeWidget } from "~/widgets/link-tree/LinkTreeWidget"
import { RepoWidget } from "~/widgets/repo/RepoWidget"
import { TaskListWidget } from "~/widgets/task-list/TaskListWidget"

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
        <StatusIndicator kind="info" />
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

export const Page = () => (
  <div className="flex flex-col h-full">
    <Grid.Root className="p-2 flex-1 overflow-y-auto">
      <Grid.Item columns={3} rows={4}>
        <LinkTreeWidget id="5" />
      </Grid.Item>
      <Grid.Item columns={3} rows={2}>
        <ImageWidget
          id="3"
          src="https://i.pinimg.com/originals/fc/35/f2/fc35f21075cc1500fababbbbf501c2e1.gif"
        />
      </Grid.Item>
      <Grid.Item columns={4} rows={4}>
        <TaskListWidget id="1" />
      </Grid.Item>
      <Grid.Item columns={5} rows={6}>
        <TaskListWidget id="2" title="Gridwid Tasks" />
      </Grid.Item>
      <Grid.Item columns={4} rows={4}>
        <RepoWidget owner="prettycoffee" name="yet-another-generic-startpage" />
      </Grid.Item>
      <Grid.Item columns={4} rows={3}>
        <RepoWidget owner="shadcn" name="ui" />
      </Grid.Item>
      <Grid.Item columns={3} rows={2}>
        <ImageWidget
          id="4"
          src="https://i.pinimg.com/originals/10/e6/ef/10e6ef76794e3c11425387a2ee140f2c.gif"
        />
      </Grid.Item>
      <Grid.Item columns={3} rows={2}>
        <ImageWidget
          id="5"
          src="https://64.media.tumblr.com/54a945edd2641e20859d6f6537cd7423/tumblr_pwa4bogz4N1qze3hdo2_r1_500.gifv"
        />
      </Grid.Item>
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
