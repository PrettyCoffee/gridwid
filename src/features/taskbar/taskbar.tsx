import { Circle } from "lucide-react"

import { Divider } from "components/ui/divider"
import { IconButton } from "components/ui/icon-button"
import { useHashRouter } from "components/utility/hash-router"
import { cn } from "utils/cn"
import { hstack, vstack } from "utils/styles"

import { MainMenu } from "./main-menu"
import { Notifications } from "./notifications"

const MainNavigation = () => {
  const { allRoutes = [], route: currentRoute } = useHashRouter()
  const mainRoutes = allRoutes.filter(({ meta }) => meta?.isMainRoute)
  return (
    <div className={cn(hstack({ gap: 1, align: "center" }))}>
      <MainMenu />

      <Divider orientation="vertical" color="gentle" className="h-4" />
      {mainRoutes.map(({ path, meta }) => (
        <IconButton
          key={path}
          to={path}
          icon={meta?.icon ?? Circle}
          active={
            currentRoute?.path === path ||
            currentRoute?.path.startsWith(path + "/")
          }
          title={meta?.title ?? ""}
        />
      ))}
    </div>
  )
}

export const Taskbar = () => (
  <div className={cn(hstack({ gap: 4, align: "center" }), "w-full p-2 pt-0")}>
    <div
      className={cn(vstack({ align: "start", justify: "center" }), "flex-1")}
    />
    <MainNavigation />
    <div className={cn(vstack({ align: "end", justify: "center" }), "flex-1")}>
      <Notifications />
    </div>
  </div>
)
