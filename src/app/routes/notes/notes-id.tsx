import { Layout } from "components/layouts"
import { useHashRouter } from "components/utility/hash-router"
import { Note, notesData } from "features/notes"
import { NoteEditor } from "features/notes/note-editor"
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

  if (!currentNote && noteId !== "new") {
    setPath("notes")
  }

  return (
    <Layout.Multiple>
      <NotesSidebar />
      <Layout.Main>
        <div className={cn(vstack({}), "mx-auto size-full max-w-6xl flex-1")}>
          <NoteEditor key={params["id"]} noteId={noteId} />
        </div>
      </Layout.Main>
    </Layout.Multiple>
  )
}
export default NotesIdRoute
