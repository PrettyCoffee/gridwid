import { useEffect } from "react"

import { Layout } from "components/layouts"
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
          <NoteEditor key={params["id"]} noteId={noteId} />
        </div>
      </Layout.Main>
    </Layout.Multiple>
  )
}
export default NotesIdRoute
