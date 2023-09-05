import { useEffect, useRef, useState } from "react"

import { Bell, Bird, Sticker, Flame, Banana, Ghost } from "lucide-react"

import { Grid, GridSize } from "~/components/Grid"
import { IconButton } from "~/components/IconButton"
import { TaskBar } from "~/components/TaskBar"
import { Button } from "~/components/ui/button"
import { Calendar } from "~/components/ui/calendar"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover"

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
      <Button variant="ghost" className="px-2">
        <Clock />
        <Bell className="ml-2 h-4 w-4" />
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
        <IconButton icon={Bird} />
        <IconButton icon={Banana} />
        <IconButton icon={Sticker} />
        <IconButton icon={Flame} />
        <IconButton icon={Ghost} />
      </Card>
      <Card className="p-2">
        <Calendar />
      </Card>
    </PopoverContent>
  </Popover>
)

const ItemContent = () => (
  <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-950">
    <CardHeader>
      <CardTitle>Create project</CardTitle>
      <CardDescription>Deploy your new project in one-click.</CardDescription>
    </CardHeader>
    <CardContent>Bli bla blub</CardContent>
    <div className="flex-1" />
    <CardFooter className="flex justify-between">
      <Button variant="outline">Cancel</Button>
      <Button>Deploy</Button>
    </CardFooter>
  </div>
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
      {items.map(({ id, ...size }) => (
        <Grid.Item key={id} {...size}>
          <Card className="w-full h-full overflow-hidden">
            <ItemContent />
          </Card>
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
