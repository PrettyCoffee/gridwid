import { useEffect, useMemo } from "react"

import { Layout } from "components/layouts"
import { NoData } from "components/ui/no-data"
import { useHashRouter } from "components/utility/hash-router"
import { Note, notesData } from "data/notes"
import { NoteEditor } from "features/notes"
import { useAtomValue } from "lib/yaasl"
import { cn } from "utils/cn"
import { vstack } from "utils/styles"

import { NotesSidebar } from "./notes-sidebar"

const getNoteById = (notes: Note[], id?: string) =>
  !id ? undefined : notes.find(note => note.id === id)

const NotesIdRoute = () => {
  const { params, setPath } = useHashRouter()
  const notes = useAtomValue(notesData)
  const noteId = params["id"] ?? ""
  const currentNote = getNoteById(notes, noteId)

  const note = useMemo(
    () => notes.find(({ id }) => id === noteId),
    [noteId, notes]
  )

  useEffect(() => {
    if (!currentNote && noteId !== "new") {
      setPath("notes")
    }
  }, [currentNote, noteId, setPath])

  return (
    <Layout.Multiple>
      <NotesSidebar />
      <Layout.Main className="ml-2 pb-2 pl-2">
        <div className={cn(vstack({}), "mx-auto size-full max-w-6xl flex-1")}>
          {!note && noteId !== "new" ? (
            <NoData label="Note does not exist anymore" />
          ) : (
            <NoteEditor
              key={params["id"]}
              note={note}
              onDelete={notesData.actions.remove}
              onSave={(noteId, data) => {
                if (noteId === "new") {
                  notesData.actions.add(data)
                  const id = notesData.get().at(-1)?.id ?? ""
                  setPath(`notes/${id}`)
                } else {
                  notesData.actions.edit(noteId, data)
                }
              }}
            />
          )}
        </div>
      </Layout.Main>
    </Layout.Multiple>
  )
}
export default NotesIdRoute
