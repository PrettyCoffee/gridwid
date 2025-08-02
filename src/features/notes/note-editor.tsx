import { useMemo } from "react"

import { Divider } from "components/ui/divider"
import { Editor } from "components/ui/editor"
import { MDPreview } from "components/ui/md-preview"
import { NoData } from "components/ui/no-data"
import { useHashRouter } from "components/utility/hash-router"
import { ScrollArea } from "components/utility/scroll-area"
import { Note, notesData } from "data/notes"
import { useAtomValue } from "lib/yaasl"
import { cn } from "utils/cn"
import { surface, vstack } from "utils/styles"

import { NoteEditorHeader } from "./note-editor-header"

const emptyNote: Note = {
  id: "new",
  title: "",
  text: "",
  createdAt: Date.now(),
  locked: false,
}

const NoteText = ({ locked, text }: Note) =>
  locked ? (
    <ScrollArea>
      <MDPreview value={text} className="ml-4" />
    </ScrollArea>
  ) : (
    <Editor.Markdown
      field="text"
      placeholder="Start writing your note..."
      className="flex-1"
    />
  )

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
        <NoteEditorHeader
          note={note}
          onDelete={notesData.actions.remove}
          onLockedChange={(id, locked) =>
            notesData.actions.edit(id, { locked })
          }
        />

        <div className="w-full px-2.5 py-2">
          <Divider color="gentle" />
        </div>

        <NoteText {...note} />
      </div>
    </Editor.Provider>
  )
}
