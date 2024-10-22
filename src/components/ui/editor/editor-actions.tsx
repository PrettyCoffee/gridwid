import { Save, Undo } from "lucide-react"

import { cn } from "utils/cn"

import { IconButton } from "../icon-button"
import { useEditorContext } from "./editor-context"

export const EditorSave = () => {
  const editor = useEditorContext()

  return (
    <IconButton
      icon={Save}
      title="Save changes"
      onClick={() => editor.save()}
      disabled={!editor.didChange}
      className={cn(!editor.didChange && "opacity-10")}
    />
  )
}

export const EditorDicsard = () => {
  const editor = useEditorContext()

  return (
    <IconButton
      icon={Undo}
      title="Discard changes"
      onClick={() => editor.discard()}
      disabled={!editor.didChange}
      className={cn(!editor.didChange && "opacity-10")}
    />
  )
}
