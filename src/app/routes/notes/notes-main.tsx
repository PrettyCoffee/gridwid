import { useAtomValue } from "@yaasl/react"

import { Layout } from "components/layouts"
import { NoData } from "components/ui/no-data"
import { notesData } from "features/notes"

import { NotesSidebar } from "./notes-sidebar"

const NotesMainRoute = () => {
  const notes = useAtomValue(notesData)
  return (
    <Layout.Multiple>
      <NotesSidebar />
      <Layout.Centered>
        {notes.length < 1 ? (
          <NoData label="There are no notes to display yet. Get started and creat some!" />
        ) : (
          <>
            Notes overview
            {notes.map(({ id, title }) => (
              <div key={id}>{title}</div>
            ))}
          </>
        )}
      </Layout.Centered>
    </Layout.Multiple>
  )
}
export default NotesMainRoute
