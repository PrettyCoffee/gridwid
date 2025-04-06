import { Layout } from "components/layouts"
import { Button } from "components/ui/button"
import { NoData } from "components/ui/no-data"
import { Masonry } from "components/utility/masonry"
import { notesSearch, notesData } from "features/notes"
import { NotePreview } from "features/notes/note-preview"
import { useAtomValue } from "lib/yaasl"
import { cn } from "utils/cn"
import { vstack } from "utils/styles"

import { NotesSidebar } from "./notes-sidebar"

const NotesMainRoute = () => {
  const notes = useAtomValue(notesData)
  const searchResult = useAtomValue(notesSearch)

  return (
    <Layout.Multiple>
      {notes.length === 0 ? (
        <Layout.Centered>
          <NoData label="There are no notes to display yet. Get started and creat some!">
            <Button look="key" to="notes/new">
              Write a note!
            </Button>
          </NoData>
        </Layout.Centered>
      ) : (
        <>
          <NotesSidebar />
          <div
            className={cn(
              vstack({}),
              "-m-2 -mr-3 h-[calc(100%+theme(height.2))] flex-1 overflow-auto pr-1"
            )}
          >
            <Masonry.Grid minItemWidth={23} className="flex-1">
              {searchResult.map(note => (
                <Masonry.Item key={note.id} maxHeight={40} className="p-2">
                  <NotePreview {...note} />
                </Masonry.Item>
              ))}
            </Masonry.Grid>
          </div>
        </>
      )}
    </Layout.Multiple>
  )
}
export default NotesMainRoute
