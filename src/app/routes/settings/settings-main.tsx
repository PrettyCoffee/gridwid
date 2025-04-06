import { Circle } from "lucide-react"

import { Icon } from "components/ui/icon"
import {
  HashRouter,
  HashRouterLinkProps,
  useHashRouter,
} from "components/utility/hash-router"
import { ClassNameProp, IconProp } from "types/base-props"
import { cn } from "utils/cn"
import { interactive, surface, vstack } from "utils/styles"

interface BigButtonProps
  extends Required<IconProp>,
    ClassNameProp,
    HashRouterLinkProps {
  label: string
  details?: string[]
}
const BigButton = ({ icon, label, className, ...props }: BigButtonProps) => (
  <HashRouter.Link
    {...props}
    className={cn(
      interactive({ look: "flat" }),
      vstack({ inline: true, align: "center", justify: "center", gap: 2 }),
      surface({ look: "card", size: "lg" }),
      "shade-sm bgl-base-background h-32 w-48",
      className
    )}
  >
    <Icon icon={icon} size="lg" />
    {label}
  </HashRouter.Link>
)

const SettingsMainRoute = () => {
  const { route } = useHashRouter()
  return (
    <>
      <h1 className="text-text-gentle mx-auto mb-10 w-max text-3xl">
        Settings
      </h1>
      <div className="grid grid-cols-3 gap-6">
        {route?.subroutes?.map(({ path, meta }) => (
          <BigButton
            key={path}
            to={path}
            icon={meta?.icon ?? Circle}
            label={meta?.title ?? ""}
          />
        ))}
      </div>
    </>
  )
}

export default SettingsMainRoute
