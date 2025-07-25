import { useMemo } from "react"

import { css } from "goober"
import { LockKeyhole, Trash, X, LockKeyholeOpen } from "lucide-react"

import { Divider } from "components/ui/divider"
import { Editor } from "components/ui/editor"
import { IconButton } from "components/ui/icon-button"
import { MDPreview } from "components/ui/md-preview"
import { NoData } from "components/ui/no-data"
import { useHashRouter } from "components/utility/hash-router"
import { ScrollArea } from "components/utility/scroll-area"
import { Note, notesData } from "data/notes"
import { useAtomValue } from "lib/yaasl"
import { cn } from "utils/cn"
import { formatDate } from "utils/format"
import { surface, vstack } from "utils/styles"

import { deleteNote } from "./delete-note"

const emptyNote: Note = {
  id: "new",
  title: "",
  text: "",
  createdAt: Date.now(),
  locked: false,
}

const NoteActions = ({ note }: { note: Note }) => (
  <>
    {!note.locked && (
      <>
        <Editor.Save disabled={note.locked} />
        <Editor.Discard disabled={note.locked} />
        <IconButton
          icon={Trash}
          onClick={() => deleteNote(note.id, note.title)}
          title="Delete note"
          disabled={note.locked}
        />
      </>
    )}
    {note.id !== "new" && (
      <IconButton
        icon={note.locked ? LockKeyhole : LockKeyholeOpen}
        title={note.locked ? "Allow changes" : "Lock from changes"}
        onClick={() =>
          notesData.actions.edit(note.id, { locked: !note.locked })
        }
      />
    )}
    <IconButton icon={X} to="notes" title="Close note" />
  </>
)

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

interface NoteEditorProps {
  noteId: string
}
export const NoteEditor = ({ noteId }: NoteEditorProps) => {
  const { setPath } = useHashRouter()
  const notes = useAtomValue(notesData)
  const note = useMemo(
    () => notes.find(({ id }) => id === noteId) ?? emptyNote,
    [noteId, notes]
  )
  const state = useMemo(
    () => ({
      title: note.title,
      text: note.text,
    }),
    [note]
  )

  if (note === emptyNote && noteId !== "new")
    return <NoData label="Note does not exist anymore" />

  return (
    <Editor.Provider
      subject="Note"
      state={state}
      validateFields={{ title: Boolean }}
      setState={state => {
        if (noteId === "new") {
          notesData.actions.add(state)
          const id = notesData.get().at(-1)?.id ?? ""
          setPath(`notes/${id}`)
        } else {
          notesData.actions.edit(note.id, state)
        }
      }}
    >
      <div
        className={cn(
          surface({ look: "card", size: "lg" }),
          vstack({}),
          "flex-1 overflow-hidden p-2"
        )}
      >
        <div className={cn(headerSections.root)}>
          {note.locked ? (
            <h1 className={cn(headerSections.title, "py-1 pl-2.5 text-2xl")}>
              {note.title}
            </h1>
          ) : (
            <Editor.TextInput
              field="title"
              placeholder="Note title"
              className={cn(headerSections.title, "w-full text-2xl")}
            />
          )}
          <div className={cn(headerSections.actions)}>
            <NoteActions note={note} />
          </div>
          <div
            className={cn(
              headerSections.subtitle,
              "pl-2.5 text-sm text-text-gentle"
            )}
          >
            #{note.id}
            {note.id !== "new" && <> | Created {formatDate(note.createdAt)}</>}
            {note.changedAt && (
              <> | Last changed {formatDate(note.changedAt)}</>
            )}
          </div>
        </div>

        <div className="w-full px-2.5 py-2">
          <Divider color="gentle" />
        </div>

        {note.locked ? (
          <ScrollArea>
            <MDPreview value={note.text} className="ml-4" />
          </ScrollArea>
        ) : (
          <Editor.Markdown
            field="text"
            placeholder="Start writing your note..."
            className="flex-1"
          />
        )}
      </div>
    </Editor.Provider>
  )
}
