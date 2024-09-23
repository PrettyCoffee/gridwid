import { PropsWithChildren } from "react"

import { Button } from "components/ui/button"
import { useHashRouter } from "components/utility/hash-router"
import { BaseRoute } from "components/utility/hash-router/types"
import { cn } from "utils/cn"

import { Layout } from "./layout"

const getSettingsPages = (routes: BaseRoute[]) =>
  routes.find(({ path }) => path === "settings")?.subroutes ?? []

export const SettingsLayout = ({ children }: PropsWithChildren) => {
  const { path, allRoutes } = useHashRouter()

  return (
    <Layout.Multiple>
      <Layout.Side
        back={{ path: "settings", caption: "Back to overview" }}
        className={cn(path === "settings" && "hidden")}
      >
        {getSettingsPages(allRoutes).map(route => (
          <Button
            key={route.path}
            to={route.path}
            icon={route.meta?.icon}
            active={path === route.path}
            className="justify-start"
          >
            {route.meta?.title}
          </Button>
        ))}
      </Layout.Side>

      <Layout.Centered>{children}</Layout.Centered>
    </Layout.Multiple>
  )
}
