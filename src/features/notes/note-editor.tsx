import { cva } from "class-variance-authority"
import { X, Save } from "lucide-react"
import { Dispatch, useState } from "react"

import { IconButton } from "components/ui/icon-button"
import { NoData } from "components/ui/no-data"
import { useAtomValue } from "lib/yaasl"
import { cn } from "utils/cn"
import { formatDateTime } from "utils/format"
import { hstack, surface } from "utils/styles"

import { notesData } from "./notes-data"

const inputBorder = cva("rounded border outline-none", {
  variants: {
    isEditing: {
      true: "border-muted-foreground focus-within:border-stroke-marked",
      false: "hover:border-muted-foreground border-transparent",
    },
  },
})

interface InputProps {
  value: string
  onChange: Dispatch<string>
  changed: boolean
}

const TitleEditor = ({ value, onChange, changed }: InputProps) => {
  const [hasFocus, setHasFocus] = useState(false)
  const isEditing = hasFocus || changed

  return (
    <input
      onFocus={() => setHasFocus(true)}
      onBlur={() => setHasFocus(false)}
      value={value}
      onChange={({ currentTarget }) => onChange(currentTarget.value)}
      className={cn(
        hstack({}),
        inputBorder({ isEditing }),
        "text-text inline-flex h-10 flex-1 justify-center truncate bg-transparent px-3 text-2xl"
      )}
    />
  )
}

const ContentEditor = ({ value, onChange, changed }: InputProps) => {
  const [hasFocus, setHasFocus] = useState(false)
  const isEditing = hasFocus || changed

  return (
    <textarea
      onFocus={() => setHasFocus(true)}
      onBlur={() => setHasFocus(false)}
      value={value}
      onChange={({ currentTarget }) => onChange(currentTarget.value)}
      className={cn(
        inputBorder({ isEditing }),
        "text-text text-md block min-h-48 w-full flex-1 bg-transparent px-3 py-1"
      )}
    />
  )
}

interface NoteEditorProps {
  noteId: string
}
export const NoteEditor = ({ noteId }: NoteEditorProps) => {
  const note = useAtomValue(notesData).find(({ id }) => id === noteId)

  const [title, setTitle] = useState(note?.title ?? "")
  const [text, setText] = useState(note?.text ?? "")

  if (!note) return <NoData label="Note does not exist anymore" />

  const titleChanged = title !== note.title
  const textChanged = text !== note.text

  const hasChanged = titleChanged || textChanged

  return (
    <div
      className={cn(surface({ look: "card", size: "lg" }), "w-full max-w-4xl")}
    >
      <div className={cn(hstack({}))}>
        <TitleEditor value={title} changed={titleChanged} onChange={setTitle} />

        <span className="pr-4" />

        <IconButton
          icon={Save}
          title="Save"
          onClick={() => notesData.actions.edit(note.id, { title, text })}
          disabled={!hasChanged}
          className={cn(!hasChanged && "opacity-10")}
        />
        <IconButton
          icon={X}
          title="Discard changes"
          onClick={() => {
            setTitle(note.title)
            setText(note.text)
          }}
          disabled={!hasChanged}
          className={cn(!hasChanged && "opacity-10")}
        />
      </div>

      <div className="text-text-gentle mx-3 mb-2 text-sm">
        {note.editedAt ? (
          <>Last edited {formatDateTime(note.editedAt)}</>
        ) : (
          <>Created {formatDateTime(note.createdAt)}</>
        )}
      </div>

      <ContentEditor value={text} changed={textChanged} onChange={setText} />
    </div>
  )
}
