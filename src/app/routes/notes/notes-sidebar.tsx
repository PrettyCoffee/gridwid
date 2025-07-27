import { Plus } from "lucide-react"

import { Layout } from "components/layouts"
import { useHashRouter } from "components/utility/hash-router"
import { NotesList } from "features/notes"

export const NotesSidebar = () => {
  const { params } = useHashRouter()

  return (
    <Layout.Side
      back={
        !params["id"] ? undefined : { to: "notes", title: "Back to overview" }
      }
      actions={[{ icon: Plus, title: "Create new", to: "notes/new" }]}
    >
      <NotesList activeNoteId={params["id"]} />
    </Layout.Side>
  )
}
