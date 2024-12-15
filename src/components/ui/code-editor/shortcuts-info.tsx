import { Command } from "lucide-react"

import { cn } from "utils/cn"

import { vstack } from "../../../utils/styles"
import { Icon } from "../icon"
import { Tooltip } from "../tooltip"

const Shortcut = ({
  keys,
  description,
}: {
  keys: string[]
  description: string
}) => (
  <div>
    <span className="bg-background-invert/10 text-text-gentle my-0.5 inline-block rounded-sm px-1 py-0.5 font-mono text-xs">
      {keys.join(" + ")}
    </span>
    : {description}
  </div>
)

export const ShortcutsInfo = () => (
  <Tooltip.Root>
    <Tooltip.Trigger asChild>
      <span
        className={cn(
          vstack({ align: "center", justify: "center" }),
          "size-10 cursor-default"
        )}
      >
        <Icon icon={Command} color="gentle" size="sm" />
      </span>
    </Tooltip.Trigger>
    <Tooltip.Portal>
      <Tooltip.Content side="left" align="start" alignOffset={2}>
        <span>Available shortcuts:</span>
        <Shortcut keys={["ctrl", "s"]} description="Save changes" />
        <Shortcut keys={["ctrl", "d"]} description="Delete line(s)" />
        <Shortcut keys={["ctrl", "insrt"]} description="Duplicate line(s)" />
        <Shortcut keys={["alt", "↑/↓"]} description="Move line(s)" />
      </Tooltip.Content>
    </Tooltip.Portal>
  </Tooltip.Root>
)