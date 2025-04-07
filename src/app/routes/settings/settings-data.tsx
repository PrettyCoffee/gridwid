import { Download, Trash } from "lucide-react"
import { z, ZodError } from "zod"

import { Layout } from "components/layouts"
import { Button } from "components/ui/button"
import { Card } from "components/ui/card"
import { showDialog } from "components/ui/dialog"
import { FileInput } from "components/ui/file-input/file-input"
import { showToast } from "components/ui/toaster"
import { noteSchema, notesData } from "features/notes"
import { createDerived } from "lib/yaasl"
import { cn } from "utils/cn"
import { hstack, vstack } from "utils/styles"

import { Resolve } from "../../../types/util-types"
import { download } from "../../../utils/download"

const allDataSchema = z.object({
  notes: z.optional(z.array(noteSchema)),
})

type AllData = Resolve<z.infer<typeof allDataSchema>>

const allData = createDerived<AllData>(
  ({ get }) => {
    const notes = get(notesData)
    return { notes }
  },

  ({ value, set }) => {
    if (value.notes) set(notesData, value.notes)
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

class ImportError extends Error {}
const parse = (content: string): unknown => {
  try {
    return JSON.parse(content)
  } catch {
    throw new ImportError("The file you selected could not be parsed.")
  }
}

const validateSchema = (data: unknown) => {
  try {
    return allDataSchema.parse(data)
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
      .then(validateSchema)
      .then(atLeastOneKey)

    allData.set(prev => ({ ...prev, ...data }))
    showToast({
      kind: "success",
      title: "Data imported",
    })
    window.location.hash = ""
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
