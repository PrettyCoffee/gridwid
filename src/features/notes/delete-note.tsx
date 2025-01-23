import { showDialog } from "components/ui/dialog"
import { showToast } from "components/ui/toaster"

import { notesData } from "./notes-data"

export const deleteNote = (id: string, title: string) =>
  showDialog({
    title: "Delete note",
    description: (
      <>
        Clicking on &quot;Delete note&quot; will remove all data related to your
        note <span className="text-highlight">&quot;{title}&quot;</span>. This
        action cannot be undone.
      </>
    ),
    confirm: {
      look: "destructive",
      caption: "Delete note",
      onClick: () => {
        notesData.actions.remove(id)
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
