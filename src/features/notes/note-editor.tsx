import { LockKeyhole, Trash, X, LockKeyholeOpen } from "lucide-react"
import { useMemo } from "react"

import { Divider } from "components/ui/divider"
import { Editor } from "components/ui/editor"
import { IconButton } from "components/ui/icon-button"
import { MDPreview } from "components/ui/md-preview"
import { NoData } from "components/ui/no-data"
import { useHashRouter } from "components/utility/hash-router"
import { ScrollArea } from "components/utility/scroll-area"
import { useAtomValue } from "lib/yaasl"
import { cn } from "utils/cn"
import { formatDate } from "utils/format"
import { hstack, surface, vstack } from "utils/styles"

import { deleteNote } from "./delete-note"
import { Note, notesData } from "./notes-data"

const emptyNote: Note = {
  id: "new",
  title: "",
  text: "",
  createdAt: Date.now(),
  locked: false,
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
      <div className={cn(hstack({ justify: "end" }), "mb-2")}>
        <Editor.Save disabled={note.locked} />
        <Editor.Discard disabled={note.locked} />
        <IconButton
          icon={Trash}
          onClick={() => deleteNote(note.id, note.title)}
          title="Delete note"
          disabled={note.locked}
        />
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
      </div>

      <div
        className={cn(
          surface({ look: "card", size: "lg" }),
          vstack({}),
          "flex-1 overflow-hidden"
        )}
      >
        {note.locked ? (
          <h1 className={"py-1 pl-3 text-2xl"}>{note.title}</h1>
        ) : (
          <Editor.TextInput
            field="title"
            className="w-full text-2xl"
            placeholder="Note title"
          />
        )}

        <div className="text-text-gentle mx-3 mb-0 text-sm">
          #{note.id}
          {note.id !== "new" && <> | Created {formatDate(note.createdAt)}</>}
          {note.changedAt && <> | Last changed {formatDate(note.changedAt)}</>}
        </div>

        <div className="w-full px-3 py-2">
          <Divider color="gentle" />
        </div>

        {note.locked ? (
          <ScrollArea>
            <MDPreview value={note.text} />
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
