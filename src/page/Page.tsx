import { Grid } from "~/components/grid"
import { GridSize } from "~/components/grid/Grid"
import { Button } from "~/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"

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
  { id: 7, columns: 3, rows: 1 },
]

export const Page = () => (
  <Grid.Root className="p-2">
    {items.map(({ id, ...size }) => (
      <Grid.Item key={id} {...size}>
        <Card className="w-full h-full overflow-hidden">
          <ItemContent />
        </Card>
      </Grid.Item>
    ))}
  </Grid.Root>
)
