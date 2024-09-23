import { Layout } from "components/layouts"
import { useHashRouter } from "components/utility/hash-router"
import { Note, notesData } from "features/notes"
import { useAtomValue } from "lib/yaasl"

import { NotesSidebar } from "./notes-sidebar"

const getNoteById = (notes: Note[], id?: string) =>
  !id ? undefined : notes.find(note => note.id === id)

const NotesIdRoute = () => {
  const { params, setPath } = useHashRouter()
  const notes = useAtomValue(notesData)
  const currentNote = getNoteById(notes, params["id"])

  if (!currentNote) {
    setPath("notes")
  }

  return (
    <Layout.Multiple>
      <NotesSidebar />
      <Layout.Centered>Notes id: {params["id"]}</Layout.Centered>
    </Layout.Multiple>
  )
}
export default NotesIdRoute
