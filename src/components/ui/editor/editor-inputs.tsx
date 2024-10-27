import { cva } from "class-variance-authority"
import { useState } from "react"

import { ClassNameProp } from "types/base-props"
import { cn } from "utils/cn"
import { hstack } from "utils/styles"

import { useEditorContext } from "./editor-context"

const inputBorder = cva("rounded border outline-none", {
  variants: {
    kind: {
      default: "hover:border-muted-foreground border-transparent",
      editing: "border-muted-foreground focus-within:border-stroke-marked",
      error: "border-alert-error",
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
          kind: hasError ? "error" : isEditing ? "editing" : "default",
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
          kind: hasError ? "error" : isEditing ? "editing" : "default",
        }),
        "text-text text-md block w-full resize-none bg-transparent px-3 py-1",
        className
      )}
    />
  )
}
