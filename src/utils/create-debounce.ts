export const createDebounce = (delay: number) => {
  let timeout: Timer | null = null

  const clear = () => {
    if (timeout) {
      clearTimeout(timeout)
      timeout = null
    }
  }

  const set = (fn: () => void) => {
    clear()
    timeout = setTimeout(fn, delay)
  }

  return Object.assign(set, { clear })
}
