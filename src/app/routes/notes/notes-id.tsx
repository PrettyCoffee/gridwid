import { Layout } from "components/layouts"
import { Button } from "components/ui/button"
import { NoData } from "components/ui/no-data"
import { useHashRouter } from "components/utility/hash-router"
import { getLatestId } from "data/get-next-id"
import { Note, notesData } from "data/notes"
import { NoteEditor } from "features/notes"
import { useAtomValue } from "lib/yaasl"
import { cn } from "utils/cn"
import { vstack } from "utils/styles"

import { NotesSidebar } from "./notes-sidebar"

const MissingNote = ({ noteId }: { noteId: string }) => (
  <NoData
    label={
      <>
        There is no note with the id "{noteId}".
        <br />
        Did you delete it?
      </>
    }
  >
    <Button look="key" to="notes">
      Back to overview
    </Button>
    <Button
      look="ghost"
      onClick={() =>
        notesData.actions.add({ title: "New Note", text: "" }, noteId)
      }
    >
      Create note with this id
    </Button>
  </NoData>
)

const getNoteById = (notes: Note[], id?: string) =>
  !id ? undefined : notes.find(note => note.id === id)

const NotesIdRoute = () => {
  const { params, setPath } = useHashRouter()
  const notes = useAtomValue(notesData)
  const activeNoteId = params["id"] ?? ""
  const currentNote = getNoteById(notes, activeNoteId)

  return (
    <Layout.Multiple>
      <NotesSidebar />
      <Layout.Main className="ml-2 pb-2 pl-2">
        <div
          className={cn(
            vstack({ justify: "center" }),
            "mx-auto size-full max-w-6xl flex-1"
          )}
        >
          {!currentNote && activeNoteId !== "new" ? (
            <MissingNote noteId={activeNoteId} />
          ) : (
            <NoteEditor
              key={activeNoteId}
              note={currentNote}
              onDelete={noteId => {
                notesData.actions.remove(noteId)
                setPath("notes")
              }}
              onSave={(noteId, data) => {
                if (noteId === "new") {
                  notesData.actions.add(data)
                  setPath(`notes/${getLatestId()}`)
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
