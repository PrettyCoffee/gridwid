export const createDebounce = (delay: number) => {
  let timeout: number | null = null

  const clear = () => {
    if (!timeout) return
    clearTimeout(timeout)
    timeout = null
  }

  const set = (fn: () => void) => {
    clear()
    timeout = window.setTimeout(fn, delay)
  }

  return Object.assign(set, { clear })
}
