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
  <div className={cn(surface({ look: "card", size: "lg" }), "size-full")}>
    <HashRouter.Link to={`notes/${id}`}>
      <h2 className="text-text-priority text-2xl underline-offset-4 hover:underline">
        {title}
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
