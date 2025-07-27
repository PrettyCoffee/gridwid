import { PropsWithChildren } from "react"

import { Button } from "components/ui/button"
import { useHashRouter } from "components/utility/hash-router"
import { BaseRoute } from "components/utility/hash-router/types"
import { ScrollArea } from "components/utility/scroll-area"

import { Layout } from "./layout"

const getSettingsPages = (routes: BaseRoute[]) =>
  routes.find(({ path }) => path === "settings")?.subroutes ?? []

const SettingsCategoryLayout = ({ children }: PropsWithChildren) => {
  const { path, route, allRoutes } = useHashRouter()

  return (
    <Layout.Multiple>
      <Layout.Side back={{ to: "settings", title: "Back to overview" }}>
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

      <Layout.Main>
        <h1 className="mx-auto mt-4 mb-3 w-full max-w-2xl pl-2 text-2xl font-bold">
          Settings
          <span className="after:mx-2 after:text-text-gentle after:content-['>']" />
          {route?.meta?.title}
        </h1>

        <ScrollArea innerClassName="w-full">
          <div className="mx-auto w-full max-w-2xl">{children}</div>
        </ScrollArea>
      </Layout.Main>
    </Layout.Multiple>
  )
}

const SettingsMainLayout = ({ children }: PropsWithChildren) => (
  <Layout.Centered>{children}</Layout.Centered>
)

export const SettingsLayout = {
  Main: SettingsMainLayout,
  Catagory: SettingsCategoryLayout,
}
