import { useAtomValue } from "@yaasl/react"
import { GripHorizontal, Plus, Trash } from "lucide-react"
import { forwardRef } from "react"

import { Layout } from "components/layouts"
import { Button } from "components/ui/button"
import { Divider } from "components/ui/divider"
import { IconButton } from "components/ui/icon-button"
import { List } from "components/ui/list"
import { useHashRouter } from "components/utility/hash-router"
import { Sortable } from "components/utility/sortable"
import { Note, notesData } from "features/notes"
import { deleteNote } from "features/notes/delete-note"
import { cn } from "utils/cn"

const ListItem = forwardRef<
  HTMLLIElement,
  {
    note: Note
    active?: boolean
    isPlaceholder?: boolean
  }
>(({ active, isPlaceholder, note, ...props }, ref) => (
  <List.Item
    {...props}
    ref={ref}
    active={active}
    className={cn(isPlaceholder && "[&_*]:opacity-0")}
  >
    <Sortable.Handle item={note} asChild>
      <IconButton
        icon={GripHorizontal}
        title="Re-order note"
        hideTitle
        className="cursor-grab active:cursor-grabbing"
      />
    </Sortable.Handle>

    <List.Label to={`notes/${note.id}`}>{note.title}</List.Label>
    <List.Action
      icon={Trash}
      title="Delete note"
      hideTitle
      onClick={() => deleteNote(note.id, note.title)}
    />
  </List.Item>
))

const getNoteById = (notes: Note[], id?: string) =>
  !id ? undefined : notes.find(note => note.id === id)

export const NotesSidebar = () => {
  const { params } = useHashRouter()
  const notes = useAtomValue(notesData)
  const currentNote = getNoteById(notes, params["id"])

  return (
    <Layout.Side
      back={
        !currentNote
          ? undefined
          : { path: "notes", caption: "Back to overview" }
      }
    >
      <Button icon={Plus} className="justify-start" to="notes/new">
        Create new
      </Button>

      <Divider color="gentle" />

      <div className="-m-1 flex-1 overflow-auto p-1">
        <Sortable.Context<Note>
          items={notes}
          onSort={sort => notesData.set(sort(notesData.get()))}
          OverlayItem={({ item }) => (
            <div className="bg-background-page shade-medium">
              <ListItem
                note={item}
                key={item.id}
                active={item.id === currentNote?.id}
              />
            </div>
          )}
        >
          <List.Root>
            {notes.map(note => (
              <Sortable.Item<Note> key={note.id} item={note} asChild>
                {({ isDragging }) => (
                  <ListItem
                    note={note}
                    isPlaceholder={isDragging}
                    active={note.id === currentNote?.id}
                  />
                )}
              </Sortable.Item>
            ))}
          </List.Root>
        </Sortable.Context>
      </div>
    </Layout.Side>
  )
}
