import { useEffect } from "react"

import { GripHorizontal, LockKeyhole, Trash } from "lucide-react"

import { Icon } from "components/ui/icon"
import { IconButton } from "components/ui/icon-button"
import { List } from "components/ui/list"
import { TextInput } from "components/ui/text-input"
import { ScrollArea } from "components/utility/scroll-area"
import { Sortable } from "components/utility/sortable"
import { Note, notesData, notesSearch, notesSearchData } from "data/notes"
import { deleteNote } from "features/notes/delete-note"
import { useAtomValue } from "lib/yaasl"
import { RefProp } from "types/base-props"
import { cn } from "utils/cn"

const SearchBar = () => {
  const { filter } = useAtomValue(notesSearchData)

  useEffect(() => () => notesSearchData.actions.setFilter(""), [])

  return (
    <TextInput
      type="search"
      placeholder="Filter notes"
      value={filter}
      onChange={notesSearchData.actions.setFilter}
    />
  )
}

interface ListElementProps extends RefProp<HTMLLIElement> {
  index: number
  note: Note
  active?: boolean
  disableSortable?: boolean
  isOverlayItem?: boolean
}
const ListItem = ({
  active,
  note,
  disableSortable,
  index,
  isOverlayItem,
  ref,
  ...props
}: ListElementProps) => (
  <Sortable.Item<Note> index={index} item={note} asChild>
    {({ isDragging, isDropping }) => (
      <List.Item
        {...props}
        ref={ref}
        active={active}
        className={cn(
          !isOverlayItem &&
            (isDragging || isDropping) &&
            "bg-background pointer-events-none **:opacity-0"
        )}
      >
        <Sortable.Handle asChild>
          <IconButton
            icon={GripHorizontal}
            title="Re-order note"
            hideTitle
            className="cursor-grab active:cursor-grabbing"
            disabled={disableSortable}
          />
        </Sortable.Handle>
        <List.Label
          to={`notes/${note.id}`}
          labelAttachment={
            note.locked && (
              <Icon
                icon={LockKeyhole}
                color="muted"
                size="sm"
                className="ml-3 hidden [li:has(:where(:hover,:focus-visible,:active))_&]:inline-flex"
              />
            )
          }
        >
          {note.title}
        </List.Label>
        {!note.locked && (
          <List.Action
            icon={Trash}
            title="Delete note"
            hideTitle
            onClick={() => deleteNote(note.id, note.title)}
          />
        )}
      </List.Item>
    )}
  </Sortable.Item>
)

const getNoteById = (notes: Note[], id?: string) =>
  !id ? undefined : notes.find(note => note.id === id)

interface NotesListProps {
  activeNoteId?: string
}
export const NotesList = ({ activeNoteId }: NotesListProps) => {
  const notes = useAtomValue(notesSearch)
  const filter = useAtomValue(notesSearchData).filter
  const active = getNoteById(notes, activeNoteId)

  return (
    <>
      <SearchBar />

      <ScrollArea className="-m-1 h-full">
        <div className="flex-1 overflow-auto p-1">
          <Sortable.Context<Note>
            items={notes}
            onSort={sort => notesData.set(sort(notesData.get()))}
            OverlayItem={({ source }) => (
              <div className="rounded-sm bg-background shade-medium **:bgl-base-transparent! **:bgl-layer-transparent!">
                <ListItem
                  index={notes.findIndex(note => note.id === source.id)}
                  note={source.data as Note}
                  active={source.id === active?.id}
                  isOverlayItem
                />
              </div>
            )}
          >
            <List.Root>
              {notes.map((note, index) => (
                <ListItem
                  key={note.id}
                  index={index}
                  note={note}
                  active={note.id === active?.id}
                  disableSortable={!!filter}
                />
              ))}
            </List.Root>
          </Sortable.Context>
        </div>
      </ScrollArea>
    </>
  )
}
