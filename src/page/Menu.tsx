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
  History,
  LucideIcon,
  PanelBottom,
  Settings,
} from "lucide-react"

import { HStack } from "~/components/base/Stack"
import { Icon } from "~/components/Icon"
import { IconButton } from "~/components/IconButton"
import { ListItem } from "~/components/ListItem"
import { Section } from "~/components/Section"
import { ThemeToggle } from "~/components/ThemeToggle"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover"
import { Separator } from "~/components/ui/separator"

import { showChangelogModal } from "./Changelog"
import { GithubOverview, githubProfile, githubUserRepos } from "./Github"
import { IframePopup } from "./IframePopup"

interface MenuItemProps {
  icon: LucideIcon
  title: string
  onClick?: () => void
}
const MenuItem = ({ icon, title, onClick }: MenuItemProps) => (
  <ListItem.Root compact>
    <ListItem.Clickable onClick={onClick}>
      <Icon icon={icon} size="sm" />
      <ListItem.Caption title={title} />
    </ListItem.Clickable>
  </ListItem.Root>
)

const SettingsList = () => (
  <>
    <MenuItem icon={Settings} title="General" />
    <MenuItem icon={UserCircle2} title="About me" />
    <MenuItem icon={LayoutDashboard} title="Widget layout" />
    <MenuItem icon={PanelBottom} title="Taskbar" />
  </>
)

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
      <IconButton
        icon={History}
        title="View changelog"
        onClick={() => showChangelogModal.set(true)}
      />
      <HStack gap={"2"}>
        <Section title="Settings" className="min-w-[theme(width.48)]">
          <SettingsList />
        </Section>
        <Section title="Themes" className="min-w-[theme(width.48)]">
          <ThemeToggle />
        </Section>
      </HStack>
    </PopoverContent>
  </Popover>
)
