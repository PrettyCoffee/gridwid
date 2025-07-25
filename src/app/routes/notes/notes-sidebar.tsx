import { Plus } from "lucide-react"

import { Layout } from "components/layouts"
import { Button } from "components/ui/button"
import { Divider } from "components/ui/divider"
import { useHashRouter } from "components/utility/hash-router"
import { NotesList } from "features/notes"

export const NotesSidebar = () => {
  const { params } = useHashRouter()

  return (
    <Layout.Side
      back={
        !params["id"]
          ? undefined
          : { path: "notes", caption: "Back to overview" }
      }
    >
      <Button icon={Plus} className="justify-start" to="notes/new">
        Create new
      </Button>

      <Divider color="gentle" />

      <NotesList activeNoteId={params["id"]} />
    </Layout.Side>
  )
}
