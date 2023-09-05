import { PopoverAnchor } from "@radix-ui/react-popover"
import {
  MoreVertical,
  Pilcrow,
  Sticker,
  UserCircle2,
  Users2,
  Bot,
  Github,
  LayoutDashboard,
} from "lucide-react"

import { IconButton } from "~/components/IconButton"
import { ThemeToggle } from "~/components/ThemeToggle"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover"
import { Separator } from "~/components/ui/separator"

export const Menu = () => (
  <Popover>
    <PopoverAnchor className="flex items-center">
      <PopoverTrigger asChild>
        <IconButton icon={MoreVertical} title="Settings" />
      </PopoverTrigger>
      <Separator orientation="vertical" className="h-5 mx-1" />
      <IconButton icon={UserCircle2} title="User profile" />
      <IconButton icon={Users2} title="Socials" />
      <IconButton icon={Pilcrow} title="Markdown notes" />
      <IconButton icon={Bot} title="ChatGPT" />
      <IconButton icon={LayoutDashboard} title="Widgets" />
      <IconButton icon={Github} title="Github overview" />
      <IconButton icon={Sticker} title="*beep boop*" />
    </PopoverAnchor>
    <PopoverContent className="w-max max-w-xl -translate-y-1">
      <ThemeToggle />
    </PopoverContent>
  </Popover>
)
