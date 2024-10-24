import { PenBox } from "lucide-react"

import { Icon } from "components/ui/icon"
import { HashRouter } from "components/utility/hash-router"
import { cn } from "utils/cn"
import { formatDate } from "utils/format"
import { surface } from "utils/styles"

import { Note } from "./notes-data"

export const NotePreview = ({
  id,
  title,
  text,
  createdAt,
  changedAt,
}: Note) => (
  <div
    className={cn(
      surface({ look: "card", size: "lg" }),
      "hover:border-stroke/50 size-full [&:not(:hover)>*]:opacity-80"
    )}
  >
    <HashRouter.Link to={`notes/${id}`}>
      <h2 className="text-text-priority text-2xl underline-offset-4 hover:underline">
        {title}
        <span className="relative [*:not(:hover)>*>*>&]:hidden">
          <Icon
            icon={PenBox}
            size="xs"
            color="gentle"
            strokeWidth={2.5}
            className="absolute -right-3 top-0"
          />
        </span>
      </h2>
    </HashRouter.Link>
    <span className="text-text-gentle text-sm">
      {changedAt ? (
        <>Last changed {formatDate(changedAt)}</>
      ) : (
        <>Created {formatDate(createdAt)}</>
      )}
    </span>
    <p className="text-text max-w-prose whitespace-pre-wrap">{text}</p>
  </div>
)
