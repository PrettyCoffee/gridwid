import { useAtomValue } from "@yaasl/react"
import { GripHorizontal, Plus, Trash } from "lucide-react"

import { Layout } from "components/layouts"
import { Button } from "components/ui/button"
import { Divider } from "components/ui/divider"
import { IconButton } from "components/ui/icon-button"
import { List } from "components/ui/list"
import { useHashRouter } from "components/utility/hash-router"
import { createRandomNote, Note, notesData } from "features/notes"
import { deleteNote } from "features/notes/delete-note"

const ListItem = ({ id, active, title }: Note & { active?: boolean }) => (
  <List.Item active={active}>
    <IconButton
      icon={GripHorizontal}
      title="Re-order note"
      hideTitle
      className="cursor-grab active:cursor-grabbing"
    />
    <List.Label to={`notes/${id}`}>{title}</List.Label>
    <List.Action
      icon={Trash}
      title="Delete note"
      hideTitle
      onClick={() => deleteNote(id, title)}
    />
  </List.Item>
)

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
      <Button
        icon={Plus}
        className="justify-start"
        onClick={() => notesData.actions.add(createRandomNote())}
      >
        Create new
      </Button>

      <Divider color="gentle" />

      <div className="-mx-2 -my-1 flex-1 overflow-auto px-2 py-1">
        <List.Root>
          {notes.map(note => (
            <ListItem
              {...note}
              key={note.id}
              active={note.id === currentNote?.id}
            />
          ))}
        </List.Root>
      </div>
    </Layout.Side>
  )
}
