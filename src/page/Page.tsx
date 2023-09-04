import { useEffect, useRef, useState } from "react"

import { Circle, Plus, Bell } from "lucide-react"

import { Grid, GridSize } from "~/components/Grid"
import { IconButton } from "~/components/IconButton"
import { TaskBar } from "~/components/TaskBar"
import { Button } from "~/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"

import { Menu } from "./Menu"

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

  const time = date.toISOString().slice(11, 16)
  const day = date.toISOString().slice(0, 10)

  return (
    <div className="mr-2">
      <div className="text-sm text-end">{time}</div>
      <div className="text-muted-foreground text-xs text-end">{day}</div>
    </div>
  )
}

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
        <Button variant="ghost" size="icon">
          <Circle
            absoluteStrokeWidth
            className="fill-green-100 text-green-100 h-5"
          />
        </Button>
        <Button variant="ghost" size="icon">
          <Circle absoluteStrokeWidth className="text-muted-foreground h-5 " />
        </Button>
        <Button variant="ghost" size="icon">
          <Circle absoluteStrokeWidth className="text-muted-foreground h-5 " />
        </Button>
        <Button variant="ghost" size="icon">
          <Plus absoluteStrokeWidth className="text-muted-foreground h-5" />
        </Button>
      </TaskBar.Section>
      <Menu />
      <TaskBar.Section>
        <Clock />
        <IconButton icon={Bell} />
      </TaskBar.Section>
    </TaskBar.Root>
  </div>
)
