import { Save, Undo } from "lucide-react"

import { IconButton } from "../icon-button"
import { useEditorContext } from "./editor-context"
import { DisableProp } from "../../../types/base-props"

export const EditorSave = ({ disabled: disabledProp }: DisableProp) => {
  const editor = useEditorContext()
  const disabled = !editor.didChange || !editor.isValid || disabledProp

  return (
    <IconButton
      icon={Save}
      title="Save changes"
      onClick={editor.save}
      disabled={disabled}
    />
  )
}

export const EditorDiscard = ({ disabled: disabledProp }: DisableProp) => {
  const editor = useEditorContext()
  const disabled = !editor.didChange || !editor.isValid || disabledProp

  return (
    <IconButton
      icon={Undo}
      title="Discard changes"
      onClick={editor.discard}
      disabled={disabled}
    />
  )
}
