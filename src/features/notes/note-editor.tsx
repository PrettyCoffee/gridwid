import { useMemo } from "react"

import { Editor } from "components/ui/editor"
import { NoData } from "components/ui/no-data"
import { useAtomValue } from "lib/yaasl"
import { cn } from "utils/cn"
import { formatDate } from "utils/format"
import { hstack, surface } from "utils/styles"

import { notesData } from "./notes-data"

interface NoteEditorProps {
  noteId: string
}
export const NoteEditor = ({ noteId }: NoteEditorProps) => {
  const note = useAtomValue(notesData).find(({ id }) => id === noteId)
  const state = useMemo(
    () => ({
      title: note?.title,
      text: note?.text,
    }),
    [note]
  )

  if (!note) return <NoData label="Note does not exist anymore" />

  return (
    <Editor.Provider
      state={state}
      setState={state => notesData.actions.edit(note.id, state)}
    >
      <div
        className={cn(
          surface({ look: "card", size: "lg" }),
          "w-full max-w-4xl"
        )}
      >
        <div className={cn(hstack({}))}>
          <Editor.TextInput field="title" className="flex-1 text-2xl" />

          <span className="pr-4" />

          <Editor.Save />
          <Editor.Discard />
        </div>

        <div className="text-text-gentle mx-3 mb-2 text-sm">
          Created {formatDate(note.createdAt)}
          {note.changedAt && <>, last changed {formatDate(note.changedAt)}</>}
        </div>

        <Editor.TextArea
          field="text"
          placeholder="Note content"
          valid={() => true}
          className="flex-1"
        />
      </div>
    </Editor.Provider>
  )
}
