import { EditorDiscard, EditorSave } from "./editor-actions"
import { EditorProvider, useEditorContext } from "./editor-context"
import {
  EditorTextArea,
  EditorTextInput,
  EditorMarkdown,
} from "./editor-inputs"

export const Editor = {
  Provider: EditorProvider,
  useContext: useEditorContext,

  TextInput: EditorTextInput,
  TextArea: EditorTextArea,
  Markdown: EditorMarkdown,

  Save: EditorSave,
  Discard: EditorDiscard,
}
