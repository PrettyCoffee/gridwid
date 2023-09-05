import { Circle } from "lucide-react"

import { IconButton } from "~/components/IconButton"

export const Workspaces = () => (
  <div className="[&:not(:hover)]:pl-2 [&:not(:hover)>*]:w-6 [&>*]:transition-all transition-all">
    <IconButton icon={Circle} className="text-blue-300 [&>svg]:fill-blue-300" />
    <IconButton icon={Circle} />
    <IconButton icon={Circle} />
  </div>
)
