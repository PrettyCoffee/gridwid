import { Dispatch } from "react"

import { css } from "goober"
import { LockKeyhole, Trash, X, LockKeyholeOpen } from "lucide-react"

import { Editor } from "components/ui/editor"
import { IconButton } from "components/ui/icon-button"
import { Note } from "data/notes"
import { cn } from "utils/cn"
import { formatDate } from "utils/format"

import { deleteNote } from "./delete-note"

const headerSections = {
  root: css`
    display: grid;
    gap: 0.5rem;
    grid-template:
      "title actions" auto
      "subtitle subtitle" auto / 1fr auto;

    @media (max-width: 800px) {
      grid-template:
        "title" auto
        "actions" auto
        "subtitle" auto
        / 1fr auto;
    }
  `,
  title: css`
    grid-area: title;
  `,
  actions: css`
    grid-area: actions;
    justify-self: end;
    white-space: nowrap;
  `,
  subtitle: css`
    grid-area: subtitle;
    align-self: end;
  `,
}

const NoteHeaderTitle = ({ locked, title }: Note) =>
  locked ? (
    <h1 className={cn(headerSections.title, "py-1 pl-2.5 text-2xl")}>
      {title}
    </h1>
  ) : (
    <Editor.TextInput
      field="title"
      placeholder="Note title"
      className={cn(headerSections.title, "w-full text-2xl")}
    />
  )

interface NoteHeaderActionsProps {
  note: Note
  onDelete: Dispatch<string>
  onLockedChange: (id: string, locked: boolean) => void
}
const NoteHeaderActions = ({
  note,
  onDelete,
  onLockedChange,
}: NoteHeaderActionsProps) => (
  <div className={cn(headerSections.actions)}>
    {!note.locked && (
      <>
        <Editor.Save disabled={note.locked} />
        <Editor.Discard disabled={note.locked} />
        <IconButton
          icon={Trash}
          onClick={() => deleteNote({ note, onDelete })}
          title="Delete note"
          disabled={note.locked}
        />
      </>
    )}
    {note.id !== "new" && (
      <IconButton
        icon={note.locked ? LockKeyhole : LockKeyholeOpen}
        title={note.locked ? "Allow changes" : "Lock from changes"}
        onClick={() => onLockedChange(note.id, !note.locked)}
      />
    )}
    <IconButton icon={X} to="notes" title="Close note" />
  </div>
)

const NoteHeaderMeta = ({ id, changedAt, createdAt }: Note) => (
  <div
    className={cn(headerSections.subtitle, "pl-2.5 text-sm text-text-gentle")}
  >
    #{id}
    {id !== "new" && <> | Created {formatDate(createdAt)}</>}
    {changedAt && <> | Last changed {formatDate(changedAt)}</>}
  </div>
)

interface NoteEditorHeadeProps extends NoteHeaderActionsProps {}

export const NoteEditorHeader = ({
  note,
  onDelete,
  onLockedChange,
}: NoteEditorHeadeProps) => (
  <div className={cn(headerSections.root)}>
    <NoteHeaderTitle {...note} />
    <NoteHeaderActions
      note={note}
      onDelete={onDelete}
      onLockedChange={onLockedChange}
    />
    <NoteHeaderMeta {...note} />
  </div>
)
