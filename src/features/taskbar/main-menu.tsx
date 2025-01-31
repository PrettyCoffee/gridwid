import { PropsWithChildren, ReactNode, useEffect, useState } from "react"

import * as Dialog from "@radix-ui/react-dialog"
import { keyframes } from "goober"
import {
  BookMarked,
  ChevronRight,
  EllipsisVertical,
  FileClock,
  Sun,
  ExternalLink,
  Bug,
} from "lucide-react"

import { Divider } from "components/ui/divider"
import { Github, Icon } from "components/ui/icon"
import { IconButton } from "components/ui/icon-button"
import { List } from "components/ui/list"
import {
  HashRouter,
  HashRouterLinkProps,
  useHashRouter,
} from "components/utility/hash-router"
import { RoutePath } from "types/routes"
import { cn } from "utils/cn"
import { hstack, interactive, surface } from "utils/styles"

import { zIndex } from "../../utils/z-index"

const enter = keyframes`
  from {
    transform: translateX(-50%) translateY(75%);
    opacity: 0;
  }
  to {
    transform: translateX(-50%) translateY(0%);
    opacity: 1;
  }
`

const leave = keyframes`
  from {
    transform: translateX(-50%) translateY(0%);
    opacity: 1;
  }
  to {
    transform: translateX(-50%) translateY(75%);
    opacity: 0;
  }
`

const useAnimateState = (
  open: boolean,
  duration: number | [number, number]
) => {
  const [state, setState] = useState<"to-open" | "open" | "to-close" | "close">(
    open ? "open" : "close"
  )

  const durations = [duration].flat()
  const enterDuration = durations[0]
  const leaveDuration = durations[1] ?? durations[0]

  useEffect(() => {
    let timeout: number
    if (open) {
      setState("to-open")
      timeout = window.setTimeout(() => setState("open"), enterDuration)
    } else {
      setState("to-close")
      timeout = window.setTimeout(() => setState("close"), leaveDuration)
    }

    return () => clearTimeout(timeout)
  }, [enterDuration, leaveDuration, open])

  return {
    state,
    entering: state.includes("open"),
    leaving: state.includes("close"),
    mounted: state !== "close",
  }
}

interface MenuProps {
  title: ReactNode
  trigger: ReactNode
}
export const Menu = ({
  title,
  trigger,
  children,
}: PropsWithChildren<MenuProps>) => {
  const [open, setOpen] = useState(false)
  const animate = useAnimateState(open, [300, 200])

  return (
    <Dialog.Root modal={false} open={animate.mounted} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Content
          className={cn(
            surface({ look: "overlay", size: "lg" }),
            "fill-mode-forwards fixed bottom-16 left-1/2 outline-none",
            animate.state !== "open" && "pointer-events-none",
            animate.leaving ? "duration-200 ease-in" : "duration-300 ease-out",
            zIndex.mainMenu
          )}
          style={{
            animationName: animate.leaving ? leave : enter,
          }}
        >
          <Dialog.Title className="sr-only">{title}</Dialog.Title>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

const CategoryLink = ({
  to,
  children,
}: PropsWithChildren<HashRouterLinkProps>) => (
  <HashRouter.Link
    to={to}
    className={cn(
      hstack({ justify: "between", align: "center" }),
      interactive({ look: "flat" }),
      "w-full rounded-md px-2 py-1"
    )}
  >
    {children}
    <Icon
      icon={ChevronRight}
      size="sm"
      color="gentle"
      className="[*:not(:hover)>&]:hidden"
    />
  </HashRouter.Link>
)

const quickSettings = new Set<RoutePath>([
  "settings/general",
  "settings/widgets",
  "settings/taskbar",
  "settings/data",
])
const SettingsNavigation = () => {
  const { allRoutes } = useHashRouter()
  return (
    <>
      <CategoryLink to="settings">Settings</CategoryLink>
      <Divider color="gentle" className="mb-1" />
      <List.Root className="w-48">
        {allRoutes
          .filter(({ path }) => quickSettings.has(path))
          .map(({ path, meta }) => (
            <List.Item key={path}>
              <List.Label to={path} icon={meta?.icon}>
                {meta?.title}
              </List.Label>
            </List.Item>
          ))}
      </List.Root>
    </>
  )
}

const links = [
  {
    title: "Github",
    href: "https://github.com/PrettyCoffee/gridwid",
    icon: Github,
  },
  {
    title: "Report an issue",
    href: "https://github.com/PrettyCoffee/gridwid/issues/new",
    icon: Bug,
  },
  {
    title: "r/startpages",
    href: "https://www.reddit.com/r/startpages/",
    icon: ExternalLink,
  },
  {
    title: "Storybook",
    href: "https://prettycoffee.github.io/gridwid/storybook",
    icon: BookMarked,
  },
]
const ExternalLinks = () => (
  <>
    <div className="px-2 py-1">External Links</div>
    <Divider color="gentle" className="mb-1" />
    <List.Root className="w-48">
      {links.map(({ title, href, icon }) => (
        <List.Item key={title}>
          <List.Label icon={icon} href={href} target="_blank">
            {title}
          </List.Label>
        </List.Item>
      ))}
    </List.Root>
  </>
)

export const MainMenu = () => {
  return (
    <Menu
      title="Main Menu"
      trigger={<IconButton title="Menu" hideTitle icon={EllipsisVertical} />}
    >
      <div className={hstack({})}>
        <IconButton title={"Light mode"} hideTitle icon={Sun} />
        <IconButton title={"Changelog"} icon={FileClock} />
        <IconButton
          title={"Go to search"}
          icon={ChevronRight}
          className="ml-auto"
        />
      </div>
      <div className={cn(hstack({ gap: 4 }), "mt-4")}>
        <Dialog.Close>
          <div>
            <SettingsNavigation />
          </div>
        </Dialog.Close>

        <div>
          <ExternalLinks />
        </div>
      </div>
    </Menu>
  )
}
