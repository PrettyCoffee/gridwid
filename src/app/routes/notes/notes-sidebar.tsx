import { useEffect } from "react"

import { Plus } from "lucide-react"

import { Layout } from "components/layouts"
import { useHashRouter } from "components/utility/hash-router"
import { notesData, notesSearch, notesSearchData } from "data/notes"
import { NotesList } from "features/notes"
import { useAtomValue } from "lib/yaasl"

export const NotesSidebar = () => {
  const { setPath, params } = useHashRouter()
  const filteredNotes = useAtomValue(notesSearch)
  const { filter } = useAtomValue(notesSearchData)
  const activeNoteId = params["id"]

  useEffect(() => () => notesSearchData.actions.setFilter(""), [])

  return (
    <Layout.Side
      back={
        !params["id"] ? undefined : { to: "notes", title: "Back to overview" }
      }
      actions={[{ icon: Plus, title: "Create new", to: "notes/new" }]}
    >
      <NotesList
        activeNoteId={activeNoteId}
        notes={filteredNotes}
        filter={filter}
        onSort={data => notesData.set(data)}
        onFilterChange={filter => notesSearchData.actions.setFilter(filter)}
        onDelete={noteId => {
          notesData.actions.remove(noteId)
          if (noteId === activeNoteId) {
            setPath("notes")
          }
        }}
      />
    </Layout.Side>
  )
}
