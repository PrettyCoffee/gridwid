import { Dispatch, useEffect } from "react"

import { Plus } from "lucide-react"

import { Layout } from "components/layouts"
import { TextInput } from "components/ui/text-input"
import { useHashRouter } from "components/utility/hash-router"
import { ScrollArea } from "components/utility/scroll-area"
import { Note, notesData, notesSearch, notesSearchData } from "data/notes"
import { NotesList } from "features/notes"
import { useAtomValue } from "lib/yaasl"

interface NoteGroup {
  groupName: string | null
  indexOffset: number
  notes: Note[]
}

const splitNotesByGroups = (notes: Note[]) =>
  notes.reduce<NoteGroup[]>((result, note, index) => {
    const groupName = note.group ?? null

    const existingGroup = result.find(
      (item): item is NoteGroup =>
        "groupName" in item && item.groupName === groupName
    )
    if (existingGroup) {
      existingGroup.notes.push(note)
    } else {
      result.push({ groupName, indexOffset: index, notes: [note] })
    }
    return result
  }, [])

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
  const groupedNotes = splitNotesByGroups(filteredNotes)
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
          {groupedNotes.map(group => (
            <NotesList
              key={group.groupName}
              group={group.groupName}
              activeNoteId={activeNoteId}
              notes={group.notes}
              disableSortable={!!filter}
              onSort={sort =>
                notesData.set(sort(filteredNotes, group.indexOffset))
              }
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
