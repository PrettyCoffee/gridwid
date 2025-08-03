import { Dispatch, useMemo } from "react"

import { Divider } from "components/ui/divider"
import { Editor } from "components/ui/editor"
import { MDPreview } from "components/ui/md-preview"
import { ScrollArea } from "components/utility/scroll-area"
import { Note } from "data/notes"
import { cn } from "utils/cn"
import { surface, vstack } from "utils/styles"

import { NoteEditorHeader } from "./note-editor-header"

const emptyNote: Note = {
  id: "new",
  title: "",
  text: "",
  createdAt: Date.now(),
  locked: false,
}

const NoteText = ({ locked, text }: Note) =>
  locked ? (
    <ScrollArea>
      <MDPreview value={text} className="ml-4" />
    </ScrollArea>
  ) : (
    <Editor.Markdown
      field="text"
      placeholder="Start writing your note..."
      className="flex-1"
    />
  )

interface NoteEditorProps {
  note?: Note
  onDelete: Dispatch<string>
  onSave: (id: string, data: Omit<Note, "id">) => void
}
export const NoteEditor = ({
  note = emptyNote,
  onSave,
  onDelete,
}: NoteEditorProps) => {
  const state = useMemo(
    () => ({
      title: note.title,
      text: note.text,
      group: note.group,
    }),
    [note]
  )

  return (
    <Editor.Provider
      subject="Note"
      state={state}
      validateFields={{ title: Boolean }}
      setState={state => onSave(note.id, { ...note, ...state })}
    >
      <div
        className={cn(
          surface({ look: "card", size: "lg" }),
          vstack({}),
          "flex-1 overflow-hidden p-2"
        )}
      >
        <NoteEditorHeader
          note={note}
          onDelete={onDelete}
          onLockedChange={(id, locked) => onSave(id, { ...note, locked })}
        />

        <div className="w-full px-2.5 pt-1 pb-2">
          <Divider color="gentle" />
        </div>

        <NoteText {...note} />
      </div>
    </Editor.Provider>
  )
}
