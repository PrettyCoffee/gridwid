import { Trash, X } from "lucide-react"
import { useMemo } from "react"

import { Divider } from "components/ui/divider"
import { Editor } from "components/ui/editor"
import { IconButton } from "components/ui/icon-button"
import { NoData } from "components/ui/no-data"
import { useHashRouter } from "components/utility/hash-router"
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
      <div className={cn(hstack({ justify: "end" }), "mb-2 w-full max-w-4xl")}>
        <Editor.Save />
        <Editor.Discard />
        <IconButton
          icon={Trash}
          className="justify-start"
          onClick={() => deleteNote(note.id, note.title)}
          title="Delete note"
        />
        <IconButton icon={X} to="notes" title="Close note" />
      </div>

      <div
        className={cn(
          surface({ look: "card", size: "lg" }),
          vstack({}),
          "w-full max-w-4xl flex-1"
        )}
      >
        <Editor.TextInput
          field="title"
          className="w-full text-2xl"
          placeholder="Note title"
        />

        <div className="text-text-gentle mx-3 mb-0 text-sm">
          Created {formatDate(note.createdAt)}
          {note.changedAt && <>, last changed {formatDate(note.changedAt)}</>}
        </div>

        <div className="w-full px-3 pb-1 pt-2">
          <Divider color="gentle" />
        </div>

        <Editor.TextArea
          field="text"
          placeholder="Note content"
          valid={() => true}
          className="flex-1"
        />
      </div>
    </Editor.Provider>
  )
}
