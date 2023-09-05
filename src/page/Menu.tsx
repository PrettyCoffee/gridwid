import { PopoverAnchor } from "@radix-ui/react-popover"
import {
  Bot,
  Github,
  LayoutDashboard,
  MoreVertical,
  Pilcrow,
  Sticker,
  UserCircle2,
  Users2,
} from "lucide-react"

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
        <IconButton icon={UserCircle2} title="User profile" />
        <IconButton icon={Users2} title="Socials" />
        <IconButton icon={Pilcrow} title="Markdown notes" />
        <IconButton icon={Bot} title="ChatGPT" />
        <IconButton icon={LayoutDashboard} />
        <IconButton icon={Github} />
        <IconButton icon={Sticker} />
      </TaskBar.Section>
    </PopoverAnchor>
    <PopoverContent className="w-max max-w-xl -translate-y-1">
      <ThemeToggle />
    </PopoverContent>
  </Popover>
)
