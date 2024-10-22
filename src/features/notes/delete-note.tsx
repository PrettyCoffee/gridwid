import { showDialog } from "components/ui/dialog"

import { notesData } from "./notes-data"

export const deleteNote = (id: string, title: string) =>
  showDialog({
    title: "Delete note",
    description: (
      <>
        Clicking on &quot;Delete note&quot; will remove all data related to your
        note <span className="text-text-highlight">&quot;{title}&quot;</span>.
        This action cannot be undone.
      </>
    ),
    confirm: {
      look: "destructive",
      caption: "Delete note",
      onClick: () => notesData.actions.remove(id),
    },
    cancel: {
      caption: "Keep note",
    },
  })
