import { Dispatch } from "react"

import { showDialog } from "components/ui/dialog"
import { showToast } from "components/ui/toaster"
import { Note } from "data/notes"

interface DeleteNote {
  note: Note
  onDelete: Dispatch<string>
}
export const deleteNote = ({ note, onDelete }: DeleteNote) =>
  showDialog({
    title: "Delete note",
    description: (
      <>
        Clicking on &quot;Delete note&quot; will remove all data related to your
        note <span className="text-highlight">&quot;{note.title}&quot;</span>.
        This action cannot be undone.
      </>
    ),
    confirm: {
      look: "destructive",
      caption: "Delete note",
      onClick: () => {
        onDelete(note.id)
        showToast({
          kind: "success",
          title: "Deleted Note",
        })
      },
    },
    cancel: {
      caption: "Keep note",
    },
  })
