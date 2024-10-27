import { Save, Undo } from "lucide-react"

import { cn } from "utils/cn"

import { IconButton } from "../icon-button"
import { useEditorContext } from "./editor-context"

export const EditorSave = () => {
  const editor = useEditorContext()
  const disabled = !editor.didChange || !editor.isValid

  return (
    <IconButton
      icon={Save}
      title="Save changes"
      onClick={editor.save}
      disabled={disabled}
      className={cn(disabled && "opacity-25")}
    />
  )
}

export const EditorDiscard = () => {
  const editor = useEditorContext()
  const disabled = !editor.didChange

  return (
    <IconButton
      icon={Undo}
      title="Discard changes"
      onClick={editor.discard}
      disabled={disabled}
      className={cn(disabled && "opacity-25")}
    />
  )
}
