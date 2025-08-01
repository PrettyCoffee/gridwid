import { Dispatch } from "react"

import { GripHorizontal, LockKeyhole, Trash } from "lucide-react"

import { Icon } from "components/ui/icon"
import { IconButton } from "components/ui/icon-button"
import { List } from "components/ui/list"
import { TextInput } from "components/ui/text-input"
import { ScrollArea } from "components/utility/scroll-area"
import { Sortable } from "components/utility/sortable"
import { Note } from "data/notes"
import { deleteNote } from "features/notes/delete-note"
import { RefProp } from "types/base-props"
import { cn } from "utils/cn"

interface SearchBarProps {
  filter: string
  onFilterChange: Dispatch<string>
}
const SearchBar = ({ filter, onFilterChange }: SearchBarProps) => (
  <TextInput
    type="search"
    placeholder="Filter notes"
    value={filter}
    onChange={onFilterChange}
  />
)

interface ListElementProps extends RefProp<HTMLLIElement> {
  index: number
  note: Note
  active?: boolean
  disableSortable?: boolean
  isOverlayItem?: boolean
  onDelete?: Dispatch<string>
}
const ListItem = ({
  active,
  note,
  disableSortable,
  index,
  isOverlayItem,
  ref,
  onDelete,
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
          className="justify-between"
          to={`notes/${note.id}`}
          label={note.title}
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
        />
        {!note.locked && onDelete && (
          <List.Action
            icon={Trash}
            title="Delete note"
            hideTitle
            onClick={() => deleteNote({ note, onDelete })}
          />
        )}
      </List.Item>
    )}
  </Sortable.Item>
)

const getNoteById = (notes: Note[], id?: string) =>
  !id ? undefined : notes.find(note => note.id === id)

interface NotesListProps {
  notes: Note[]
  filter?: string
  activeNoteId?: string
  onSort: Dispatch<Note[]>
  onDelete: Dispatch<string>
  onFilterChange: Dispatch<string>
}
export const NotesList = ({
  notes,
  filter = "",
  activeNoteId,
  onSort,
  onDelete,
  onFilterChange,
}: NotesListProps) => {
  const active = getNoteById(notes, activeNoteId)

  return (
    <>
      <SearchBar filter={filter} onFilterChange={onFilterChange} />

      <ScrollArea className="-m-1 h-full">
        <div className="flex-1 overflow-auto p-1">
          <Sortable.Context<Note>
            items={notes}
            onSort={sort => onSort(sort(notes))}
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
                  onDelete={onDelete}
                />
              ))}
            </List.Root>
          </Sortable.Context>
        </div>
      </ScrollArea>
    </>
  )
}
