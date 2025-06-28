import { PropsWithChildren, ReactNode, useState } from "react"

import * as Dialog from "@radix-ui/react-dialog"
import { keyframes } from "goober"
import {
  BookMarked,
  ChevronRight,
  EllipsisVertical,
  FileClock,
  ExternalLink,
  Bug,
  Moon,
  Sun,
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
// TODO: Adjust taskbar to pass props down here
// eslint-disable-next-line import/no-restricted-paths
import { themePreferences } from "features/theming/theme-data"
import { useMountAnimation } from "hooks/use-mount-animation"
import { useAtomValue } from "lib/yaasl"
import { RoutePath } from "types/routes"
import { cn } from "utils/cn"
import { createContext } from "utils/create-context"
import { hstack, interactive, surface } from "utils/styles"
import { zIndex } from "utils/z-index"

const ThemeModeToggle = () => {
  const mode = useAtomValue(themePreferences.selectors.getMode)
  return mode === "dark" ? (
    <IconButton
      title="Light mode"
      hideTitle
      icon={Sun}
      onClick={() => themePreferences.actions.setMode("light")}
    />
  ) : (
    <IconButton
      title="Dark mode"
      hideTitle
      icon={Moon}
      onClick={() => themePreferences.actions.setMode("dark")}
    />
  )
}

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

const { Provider, useRequiredValue } = createContext<{ closeMenu: () => void }>(
  "MainMenu"
)

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
  const animate = useMountAnimation({ open, duration: [300, 200] })

  return (
    <Provider value={{ closeMenu: () => setOpen(false) }}>
      <Dialog.Root modal={false} open={animate.mounted} onOpenChange={setOpen}>
        <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>

        <Dialog.Portal>
          <Dialog.Content
            className={cn(
              surface({ look: "overlay", size: "lg" }),
              "fill-mode-forwards fixed bottom-16 left-1/2 outline-none duration-0",
              animate.state !== "open" && "pointer-events-none",
              animate.leaving
                ? "ease-in motion-safe:duration-200"
                : "ease-out motion-safe:duration-300",
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
    </Provider>
  )
}

const CategoryLink = ({
  to,
  children,
}: PropsWithChildren<HashRouterLinkProps>) => {
  const { closeMenu } = useRequiredValue()
  return (
    <HashRouter.Link
      to={to}
      onClick={closeMenu}
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
}

const quickSettings = new Set<RoutePath>([
  "settings/general",
  "settings/widgets",
  "settings/taskbar",
  "settings/data",
])
const SettingsNavigation = () => {
  const { allRoutes } = useHashRouter()
  const { closeMenu } = useRequiredValue()
  return (
    <>
      <CategoryLink to="settings">Settings</CategoryLink>
      <Divider color="gentle" className="mb-1" />
      <List.Root className="w-48">
        {allRoutes
          .filter(({ path }) => quickSettings.has(path))
          .map(({ path, meta }) => (
            <List.Item key={path}>
              <List.Label to={path} icon={meta?.icon} onClick={closeMenu}>
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

export const MainMenu = () => (
  <Menu
    title="Main Menu"
    trigger={<IconButton title="Menu" hideTitle icon={EllipsisVertical} />}
  >
    <div className={hstack({})}>
      <ThemeModeToggle />
      <IconButton title="Changelog" icon={FileClock} />
      <IconButton
        title="Go to search"
        icon={ChevronRight}
        className="ml-auto"
      />
    </div>
    <div className={cn(hstack({ gap: 4 }), "mt-4")}>
      <div>
        <SettingsNavigation />
      </div>

      <div>
        <ExternalLinks />
      </div>
    </div>
  </Menu>
)
