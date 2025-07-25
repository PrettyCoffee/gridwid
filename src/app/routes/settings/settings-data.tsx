import { Download, Trash } from "lucide-react"
import { ZodError } from "zod"

import { Button } from "components/ui/button"
import { Card } from "components/ui/card"
import { showDialog } from "components/ui/dialog"
import { FileInput } from "components/ui/file-input/file-input"
import { showToast } from "components/ui/toaster"
import { allData, AllData } from "data/all-data"
import { cn } from "utils/cn"
import { hstack, vstack } from "utils/styles"

import { download } from "../../../utils/download"

const exportData = () => {
  const date = new Date().toISOString().slice(0, 10)
  download(`gridwid-export_${date}.json`, allData.get())
}

class ImportError extends Error {}
const parse = (content: string): unknown => {
  try {
    return JSON.parse(content)
  } catch {
    throw new ImportError("The file you selected could not be parsed.")
  }
}

const validateData = (data: unknown) => {
  try {
    return allData.validate(data)
  } catch (error) {
    if (!(error instanceof ZodError)) {
      throw error
    }
    const errorPaths = error.issues.flatMap(({ path }) => path).join(", ")
    throw new ImportError(
      `The following data fields seem to be corrupted: ${errorPaths}`
    )
  }
}

const atLeastOneKey = (data: AllData) => {
  if (Object.keys(data).length === 0) {
    throw new ImportError("The file you selected contains no usable data.")
  }
  return data
}

const importData = async (file: File) => {
  try {
    const data = await file
      .text()
      .then(parse)
      .then(validateData)
      .then(atLeastOneKey)

    allData.patch(data)
    showToast({
      kind: "success",
      title: "Data imported",
    })
  } catch (error) {
    const message =
      error instanceof ImportError
        ? error.message
        : "An unexpected error occurred during the import."
    showToast({ kind: "error", title: "Import error", message })
    console.error(error)
    return
  }
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
      - or -
      <FileInput
        label="Import data"
        onChange={file => void importData(file)}
        accept=".json"
      />
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
      onClick: () => {
        allData.reset()
        showToast({
          kind: "success",
          title: "Deleted data",
        })
      },
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
        <span className="font-bold text-text">Note: </span>
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
  <div className={cn(vstack({ gap: 2 }))}>
    <BackupData />
    <DeleteData />
  </div>
)

export default SettingsDataRoute
