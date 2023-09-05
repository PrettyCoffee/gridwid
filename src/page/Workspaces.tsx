import { Circle } from "lucide-react"

import { IconButton } from "~/components/IconButton"

export const Workspaces = () => (
  <div className="[&:not(:hover)]:pl-2 [&:not(:hover)>*]:w-6 [&>*]:transition-all transition-all">
    <IconButton
      icon={Circle}
      className="text-highlight-foreground [&>svg]:fill-highlight-foreground"
    />
    <IconButton icon={Circle} />
    <IconButton icon={Circle} />
  </div>
)
