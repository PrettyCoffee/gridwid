import { useAtomValue } from "@yaasl/react"

import { Layout } from "components/layouts"
import { NoData } from "components/ui/no-data"
import { Masonry } from "components/utility/masonry"
import { notesData } from "features/notes"
import { NotePreview } from "features/notes/note-preview"

import { NotesSidebar } from "./notes-sidebar"

const NotesMainRoute = () => {
  const notes = useAtomValue(notesData)
  return (
    <Layout.Multiple>
      <NotesSidebar />
      {notes.length < 1 ? (
        <Layout.Centered>
          <NoData label="There are no notes to display yet. Get started and creat some!" />
        </Layout.Centered>
      ) : (
        <div className="-m-2 -mr-3 flex h-[calc(100%+theme(height.2))] flex-1 flex-col overflow-auto pr-1">
          <Masonry.Grid minItemWidth={20} className="flex-1">
            {notes.map(note => (
              <Masonry.Item key={note.id} className="p-2">
                <NotePreview {...note} />
              </Masonry.Item>
            ))}
          </Masonry.Grid>
        </div>
      )}
    </Layout.Multiple>
  )
}
export default NotesMainRoute
