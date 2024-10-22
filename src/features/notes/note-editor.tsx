import { X, Save } from "lucide-react"
import { useMemo } from "react"

import { Editor } from "components/ui/editor"
import { IconButton } from "components/ui/icon-button"
import { NoData } from "components/ui/no-data"
import { useAtomValue } from "lib/yaasl"
import { cn } from "utils/cn"
import { formatDate } from "utils/format"
import { hstack, surface } from "utils/styles"

import { notesData } from "./notes-data"

const Actions = () => {
  const editor = Editor.useContext()

  return (
    <>
      <IconButton
        icon={Save}
        title="Save"
        onClick={() => editor.save()}
        disabled={!editor.didChange}
        className={cn(!editor.didChange && "opacity-10")}
      />
      <IconButton
        icon={X}
        title="Discard changes"
        onClick={() => editor.discard()}
        disabled={!editor.didChange}
        className={cn(!editor.didChange && "opacity-10")}
      />
    </>
  )
}

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

          <Actions />
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
