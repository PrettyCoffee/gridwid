type ObjectItem = Record<string, unknown>

type ObjDeepValue<T> = T extends ObjectItem
  ? {
      [K in keyof T]: ObjDeepValue<
        // Prevent endless recursion
        Exclude<T[K], T>
      >
    }[keyof T]
  : T

type DeepLoopHandler<T> = (path: string[], value: ObjDeepValue<T>) => void

const isObject = (value: unknown): value is ObjectItem =>
  typeof value === "object" && value != null

export const deepLoop = <T extends ObjectItem>(
  parent: T,
  handler: DeepLoopHandler<T>,
  prevPath: string[] = []
) =>
  Object.entries(parent).forEach(([key, value]) => {
    const path = [...prevPath, key]
    if (isObject(value)) {
      deepLoop(value, handler as unknown as DeepLoopHandler<typeof value>, path)
    } else {
      handler(path, value as ObjDeepValue<T>)
    }
  })
