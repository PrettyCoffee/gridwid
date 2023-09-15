export const removeKeyFromObject = <
  T extends Record<string, unknown>,
  Key extends keyof T
>(
  obj: T,
  key: Key
) =>
  Object.fromEntries(
    Object.entries(obj).filter(([currentKey]) => currentKey !== key)
  ) as Omit<T, Key>
