import { IconButton } from "components/ui/icon-button/icon-button"
import { showToast } from "components/ui/toaster"
import { HashRouter, useHashRouter } from "components/utility/hash-router"
import { cn } from "utils/cn"
import { formatTime } from "utils/format"
import { hstack, vstack } from "utils/styles"

import { Button } from "../../ui/button"

const MainNavigation = () => {
  const { allRoutes = [], route: currentRoute } = useHashRouter()
  const mainRoutes = allRoutes.filter(({ meta }) => meta?.isMainRoute)
  return (
    <div className={cn(hstack({ gap: 1 }))}>
      {mainRoutes.map(({ path, meta }) => (
        <HashRouter.Link key={path} to={path}>
          {meta?.icon ? (
            <IconButton
              icon={meta.icon}
              active={currentRoute?.path === path}
              title={meta.title ?? ""}
            />
          ) : (
            <>{meta?.title}</>
          )}
        </HashRouter.Link>
      ))}
    </div>
  )
}

export const Taskbar = () => (
  <div className={cn(hstack({ gap: 4, align: "center" }), "w-full p-1")}>
    <div
      className={cn(vstack({ align: "start", justify: "center" }), "flex-1")}
    />
    <MainNavigation />
    <div className={cn(vstack({ align: "end", justify: "center" }), "flex-1")}>
      <Button
        look="flat"
        onClick={() =>
          showToast({
            kind: "info",
            title: `It is ${formatTime(new Date())}`,
          })
        }
      >
        11:44PM
      </Button>
    </div>
  </div>
)
