import { Download, Trash } from "lucide-react"

import { Layout } from "components/layouts"
import { Button } from "components/ui/button"
import { Card } from "components/ui/card"
import { showDialog } from "components/ui/dialog"
import { FileInput } from "components/ui/file-input/file-input"
import { cn } from "utils/cn"
import { hstack, vstack } from "utils/styles"

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
      <Button look="key" icon={Download}>
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
      onClick: console.log,
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
