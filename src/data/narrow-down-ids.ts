import { notesData } from "./notes"

interface GenericItem {
  id: string
  createdAt: number
  [k: string]: unknown
}

const isIntegerString = (value: string) => /^\d+$/.test(value)

const getNarrowedIds = (items: GenericItem[]): Record<string, string> => {
  const numberIds = items
    .filter(({ id }) => isIntegerString(id))
    .sort((a, b) => a.createdAt - b.createdAt)

  return Object.fromEntries(
    numberIds.map(({ id }, index) => [id, String(index + 1)] as const)
  )
}

const replaceIds = <TData extends GenericItem>(
  data: TData[],
  replaceIdMap: Record<string, string>
): TData[] =>
  data.map(item => {
    const id = replaceIdMap[item.id]
    return !id ? item : { ...item, id: id }
  })

export const narrowDownIds = () => {
  const replaceIdMap = getNarrowedIds([...notesData.get()])
  notesData.set(data => replaceIds(data, replaceIdMap))
}
