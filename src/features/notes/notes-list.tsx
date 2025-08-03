import { Dispatch } from "react"

import { GripHorizontal, LockKeyhole, Trash } from "lucide-react"

import { Icon } from "components/ui/icon"
import { IconButton } from "components/ui/icon-button"
import { List } from "components/ui/list"
import { Sortable } from "components/utility/sortable"
import { Note } from "data/notes"
import { deleteNote } from "features/notes/delete-note"
import { RefProp } from "types/base-props"
import { cn } from "utils/cn"

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
  group: string
  notes: Note[]
  activeNoteId?: string
  disableSortable?: boolean
  onSort: Dispatch<Note[]>
  onDelete: Dispatch<string>
}
export const NotesList = ({
  group,
  notes,
  activeNoteId,
  disableSortable,
  onSort,
  onDelete,
}: NotesListProps) => {
  const active = getNoteById(notes, activeNoteId)

  return (
    <div>
      {!!group && <div className="py-2 text-text-gentle">{group}</div>}
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
              disableSortable={disableSortable}
              onDelete={onDelete}
            />
          ))}
        </List.Root>
      </Sortable.Context>
    </div>
  )
}
