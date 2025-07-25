import { Command } from "lucide-react"

import { cn } from "utils/cn"

import { vstack } from "../../../utils/styles"
import { Icon } from "../icon"
import { Tooltip } from "../tooltip"

interface Shortcut {
  keys: string[]
  description: string
}

const Shortcut = ({ keys, description }: Shortcut) => (
  <div>
    <span className="my-0.5 inline-block rounded-sm bg-background-invert/10 px-1 py-0.5 font-mono text-xs text-text-gentle">
      {keys.join(" + ")}
    </span>
    : {description}
  </div>
)

export interface ShortcutsInfoProps {
  /** Additional shortcuts, besides the default code editor shortcuts */
  shortcuts?: Shortcut[]

  size?: "md" | "sm"
}

export const ShortcutsInfo = ({
  shortcuts = [],
  size = "md",
}: ShortcutsInfoProps) => (
  <Tooltip.Root>
    <Tooltip.Trigger asChild>
      <span
        className={cn(
          vstack({ align: "center", justify: "center" }),
          "cursor-default",
          size === "sm" ? "size-8" : "size-10"
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
        {shortcuts.map(item => (
          <Shortcut key={item.description} {...item} />
        ))}
      </Tooltip.Content>
    </Tooltip.Portal>
  </Tooltip.Root>
)
