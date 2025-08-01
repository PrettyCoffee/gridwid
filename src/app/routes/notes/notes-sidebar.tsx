import { useEffect } from "react"

import { Plus } from "lucide-react"

import { Layout } from "components/layouts"
import { useHashRouter } from "components/utility/hash-router"
import { notesData, notesSearch, notesSearchData } from "data/notes"
import { NotesList } from "features/notes"
import { useAtomValue } from "lib/yaasl"

export const NotesSidebar = () => {
  const { params } = useHashRouter()
  const filteredNotes = useAtomValue(notesSearch)
  const { filter } = useAtomValue(notesSearchData)

  useEffect(() => () => notesSearchData.actions.setFilter(""), [])

  return (
    <Layout.Side
      back={
        !params["id"] ? undefined : { to: "notes", title: "Back to overview" }
      }
      actions={[{ icon: Plus, title: "Create new", to: "notes/new" }]}
    >
      <NotesList
        activeNoteId={params["id"]}
        notes={filteredNotes}
        filter={filter}
        onFilterChange={notesSearchData.actions.setFilter}
        onDelete={notesData.actions.remove}
        onSort={notesData.set}
      />
    </Layout.Side>
  )
}
