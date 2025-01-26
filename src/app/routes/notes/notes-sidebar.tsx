import { forwardRef } from "react"

import { useAtomValue } from "@yaasl/react"
import { GripHorizontal, Plus, Trash } from "lucide-react"

import { Layout } from "components/layouts"
import { Button } from "components/ui/button"
import { Divider } from "components/ui/divider"
import { IconButton } from "components/ui/icon-button"
import { List } from "components/ui/list"
import { TextInput } from "components/ui/text-input"
import { useHashRouter } from "components/utility/hash-router"
import { Sortable } from "components/utility/sortable"
import { Note, notesData, notesSearch, notesSearchData } from "features/notes"
import { deleteNote } from "features/notes/delete-note"
import { cn } from "utils/cn"

const SearchBar = () => {
  const { filter } = useAtomValue(notesSearchData)
  return (
    <TextInput
      type="search"
      placeholder="Filter notes"
      value={filter}
      onChange={notesSearchData.actions.setFilter}
    />
  )
}

const ListItem = forwardRef<
  HTMLLIElement,
  {
    note: Note
    active?: boolean
    disableSortable?: boolean
  }
>(({ active, note, disableSortable, ...props }, ref) => (
  <Sortable.Item<Note> key={note.id} item={note} asChild>
    {({ isDragging }) => (
      <List.Item
        {...props}
        ref={ref}
        active={active}
        className={cn(isDragging && "bg-background [&_*]:opacity-0")}
      >
        <Sortable.Handle item={note} asChild>
          <IconButton
            icon={GripHorizontal}
            title="Re-order note"
            hideTitle
            className="cursor-grab active:cursor-grabbing"
            disabled={disableSortable}
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
    )}
  </Sortable.Item>
))
ListItem.displayName = "NotesSidebarListItem"

const getNoteById = (notes: Note[], id?: string) =>
  !id ? undefined : notes.find(note => note.id === id)

export const NotesSidebar = () => {
  const { params } = useHashRouter()
  const notes = useAtomValue(notesSearch)
  const notesFilter = useAtomValue(notesSearchData).filter
  const currentNote = getNoteById(notes, params["id"])

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

      <SearchBar />

      <div className="-m-1 flex-1 overflow-auto p-1">
        <Sortable.Context<Note>
          items={notes}
          onSort={sort => notesData.set(sort(notesData.get()))}
          OverlayItem={({ item }) => (
            <div className="bg-background shade-medium [&_*]:!bgl-base-transparent [&_*]:!bgl-layer-transparent rounded-sm">
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
              <ListItem
                key={note.id}
                note={note}
                active={note.id === currentNote?.id}
                disableSortable={!!notesFilter}
              />
            ))}
          </List.Root>
        </Sortable.Context>
      </div>
    </Layout.Side>
  )
}
