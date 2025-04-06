import { Download, Trash } from "lucide-react"

import { Layout } from "components/layouts"
import { Button } from "components/ui/button"
import { Card } from "components/ui/card"
import { showDialog } from "components/ui/dialog"
import { FileInput } from "components/ui/file-input/file-input"
import { showToast } from "components/ui/toaster"
import { notesData } from "features/notes"
import { createDerived } from "lib/yaasl"
import { cn } from "utils/cn"
import { hstack, vstack } from "utils/styles"

import { download } from "../../../utils/download"

const allData = createDerived(
  ({ get }) => {
    const notes = get(notesData)
    return { notes }
  },

  ({ value, set }) => {
    set(notesData, value.notes)
  }
)

const resetData = () => {
  allData.set({ notes: notesData.defaultValue })
  showToast({
    kind: "success",
    title: "Deleted data",
  })
  window.location.hash = ""
}

const exportData = () => {
  const date = new Date().toISOString().slice(0, 10)
  download(`gridwid-export_${date}.json`, allData.get())
}

const BackupData = () => (
  <Card
    title="Backup data"
    description={
      "Backup your data and import your backups. " +
      "This is important since your data is only stored locally in your browser. " +
      "Emptying your browser cache will also delete all data and settings of gridwid."
    }
  >
    <div
      className={cn(
        hstack({
          align: "center",
          justify: "evenly",
          gap: 4,
          wrap: true,
        }),
        "text-nowrap"
      )}
    >
      <Button look="key" icon={Download} onClick={exportData}>
        Export data
      </Button>
      -or-
      <FileInput label="Import data" />
    </div>
  </Card>
)

const requestDeletion = () =>
  showDialog({
    title: "Delete all data",
    description:
      "Do you want to delete all data and reset Gridwid to its initial state?",
    confirm: {
      caption: "Confirm deletion",
      look: "destructive",
      onClick: resetData,
    },
    cancel: {
      caption: "Cancel",
      look: "flat",
    },
  })

const DeleteData = () => (
  <Card
    title="Delete data"
    description={
      <>
        Delete all data and reset Gridwid to its initial state.
        <br />
        <span className="text-text font-bold">Note: </span>
        Make sure to create a backup before deleting your data, this cannot be
        undone!
      </>
    }
  >
    <Button look="destructive" icon={Trash} onClick={requestDeletion}>
      Delete all data
    </Button>
  </Card>
)

const SettingsDataRoute = () => (
  <Layout.Main>
    <div className={cn(vstack({ gap: 4 }), "mx-auto w-full max-w-2xl")}>
      <BackupData />
      <DeleteData />
    </div>
  </Layout.Main>
)

export default SettingsDataRoute
