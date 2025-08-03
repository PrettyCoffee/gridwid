import { Dispatch, useEffect } from "react"

import { Plus } from "lucide-react"

import { Layout } from "components/layouts"
import { TextInput } from "components/ui/text-input"
import { useHashRouter } from "components/utility/hash-router"
import { ScrollArea } from "components/utility/scroll-area"
import { Note, notesData, notesSearch, notesSearchData } from "data/notes"
import { NotesList } from "features/notes"
import { useAtomValue } from "lib/yaasl"

interface NoteWithIndex extends Note {
  originalIndex: number
}

const splitNotesByGroups = (notes: Note[]) =>
  notes.reduce<Record<string, NoteWithIndex[]>>(
    (notesByGroup, note, originalIndex) => {
      const group = note.group ?? ""
      if (!notesByGroup[group]) {
        notesByGroup[group] = []
      }
      notesByGroup[group].push({ ...note, originalIndex })
      return notesByGroup
    },
    {}
  )

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

export const NotesSidebar = () => {
  const { setPath, params } = useHashRouter()
  const filteredNotes = useAtomValue(notesSearch)
  const { filter } = useAtomValue(notesSearchData)
  const notesByGroups = splitNotesByGroups(filteredNotes)
  const activeNoteId = params["id"]

  useEffect(() => () => notesSearchData.actions.setFilter(""), [])

  return (
    <Layout.Side
      back={
        !params["id"] ? undefined : { to: "notes", title: "Back to overview" }
      }
      actions={[{ icon: Plus, title: "Create new", to: "notes/new" }]}
    >
      <SearchBar
        filter={filter}
        onFilterChange={filter => notesSearchData.actions.setFilter(filter)}
      />

      <ScrollArea className="-m-1 h-full">
        <div className="flex-1 space-y-2 overflow-auto p-1">
          {Object.entries(notesByGroups).map(([group, notes]) => (
            <NotesList
              key={group}
              group={group}
              activeNoteId={activeNoteId}
              notes={notes}
              disableSortable={!!filter}
              onSort={(sort) => {
                const offset = filteredNotes.findIndex(({ id }) => notes[0]?.id === id)
                if (offset === -1) return
                notesData.set(sort(filteredNotes, offset))
              }}
              onDelete={noteId => {
                notesData.actions.remove(noteId)
                if (noteId === activeNoteId) {
                  setPath("notes")
                }
              }}
            />
          ))}
        </div>
      </ScrollArea>
    </Layout.Side>
  )
}
