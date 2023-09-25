import { PopoverAnchor } from "@radix-ui/react-popover"
import {
  MoreVertical,
  Pilcrow,
  Sticker,
  UserCircle2,
  Users2,
  Bot,
  LayoutDashboard,
  RefreshCw,
  Shell,
} from "lucide-react"

import { IconButton } from "~/components/IconButton"
import { Section } from "~/components/Section"
import { ThemeToggle } from "~/components/ThemeToggle"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover"
import { Separator } from "~/components/ui/separator"

import { GithubOverview, githubProfile, githubUserRepos } from "./Github"
import { IframePopup } from "./IframePopup"

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
      <IconButton icon={LayoutDashboard} title="Widgets" />
      <GithubOverview name="prettycoffee" />
      <IconButton icon={Sticker} title="*beep boop*" />

      <Separator orientation="vertical" className="h-5 mx-1" />

      <IframePopup
        icon={Shell}
        src="https://lucide.dev/icons/"
        title="Lucide"
      />
      <IframePopup
        icon={Bot}
        src="https://www.getdevkit.com/devgpt"
        title="DevGPT"
      />
    </PopoverAnchor>
    <PopoverContent className="w-max max-w-xl mb-1">
      <IconButton
        icon={RefreshCw}
        title="Refresh fetched data"
        clickAnimation="animate-spin-once"
        onClick={() => {
          githubProfile.set(null)
          githubUserRepos.set(null)
        }}
      />
      <Section title="Themes" className="min-w-[theme(width.48)]">
        <ThemeToggle />
      </Section>
    </PopoverContent>
  </Popover>
)
