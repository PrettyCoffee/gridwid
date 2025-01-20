import { useState } from "react"

import { cva } from "class-variance-authority"

import { ClassNameProp } from "types/base-props"
import { cn } from "utils/cn"
import { hstack } from "utils/styles"

import { useEditorContext } from "./editor-context"
import { MDEditor } from "../md-editor"

const inputBorder = cva("rounded-sm outline outline-1 -outline-offset-1", {
  variants: {
    status: {
      default: "hover:outline-stroke outline-transparent",
      editing: "outline-stroke focus-within:outline-stroke-focus",
      error: "outline-alert-error",
    },
  },
})

interface InputProps extends ClassNameProp {
  field: string
  placeholder?: string
}

export const EditorTextInput = ({ field, className, ...props }: InputProps) => {
  const input = useEditorContext().getContext(field)
  const [hasFocus, setHasFocus] = useState(false)

  const isEditing = hasFocus || input.didChange
  const hasError = !input.isValid

  return (
    <input
      {...props}
      onFocus={() => setHasFocus(true)}
      onBlur={() => setHasFocus(false)}
      value={input.value ?? ""}
      onChange={({ currentTarget }) => input.set(currentTarget.value)}
      className={cn(
        hstack({}),
        inputBorder({
          status: hasError ? "error" : isEditing ? "editing" : "default",
        }),
        "text-text text-md inline-flex h-10 justify-center truncate bg-transparent px-3",
        className
      )}
    />
  )
}

export const EditorTextArea = ({ field, className, ...props }: InputProps) => {
  const input = useEditorContext().getContext(field)
  const [hasFocus, setHasFocus] = useState(false)

  const isEditing = hasFocus || input.didChange
  const hasError = !input.isValid

  return (
    <textarea
      {...props}
      onFocus={() => setHasFocus(true)}
      onBlur={() => setHasFocus(false)}
      value={input.value ?? ""}
      onChange={({ currentTarget }) => input.set(currentTarget.value)}
      className={cn(
        inputBorder({
          status: hasError ? "error" : isEditing ? "editing" : "default",
        }),
        "text-text text-md block w-full resize-none bg-transparent px-3 py-1",
        className
      )}
    />
  )
}

export const EditorMarkdown = ({ field, ...props }: InputProps) => {
  const editor = useEditorContext()
  const input = editor.getContext(field)
  const [hasFocus, setHasFocus] = useState(false)

  const isEditing = hasFocus || input.didChange
  const hasError = !input.isValid

  return (
    <MDEditor
      {...props}
      value={input.value ?? ""}
      onChange={input.set}
      onFocus={() => setHasFocus(true)}
      onBlur={() => setHasFocus(false)}
      onSave={() => editor.save()}
      inputClassName={cn(
        inputBorder({
          status: hasError ? "error" : isEditing ? "editing" : "default",
        })
      )}
    />
  )
}
