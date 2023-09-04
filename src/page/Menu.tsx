import { PopoverAnchor } from "@radix-ui/react-popover"
import { MoreVertical, Banana, Bird, Sticker, Flame, Ghost } from "lucide-react"

import { IconButton } from "~/components/IconButton"
import { TaskBar } from "~/components/TaskBar"
import { ThemeToggle } from "~/components/ThemeToggle"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover"
import { Separator } from "~/components/ui/separator"

export const Menu = () => (
  <Popover>
    <PopoverAnchor asChild>
      <TaskBar.Section>
        <PopoverTrigger asChild>
          <IconButton icon={MoreVertical} />
        </PopoverTrigger>
        <Separator orientation="vertical" className="h-5 mx-1" />
        <IconButton icon={Bird} />
        <IconButton icon={Banana} />
        <IconButton icon={Sticker} />
        <IconButton icon={Flame} />
        <IconButton icon={Ghost} />
      </TaskBar.Section>
    </PopoverAnchor>
    <PopoverContent className="w-max max-w-xl -translate-y-1">
      <ThemeToggle />
    </PopoverContent>
  </Popover>
)
