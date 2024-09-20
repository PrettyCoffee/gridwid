export const createThrottle = (delay: number) => {
  let lastCall = 0
  let lastFn: (() => void) | null = null
  let timeout: Timer | null = null

  const clear = () => {
    if (timeout) {
      clearTimeout(timeout)
      timeout = null
      lastFn = null
    }
  }

  const callFn = () => {
    lastCall = Date.now()
    lastFn?.()
    clear()
  }

  const set = (fn: () => void) => {
    const remaining = delay - (Date.now() - lastCall)
    lastFn = fn
    if (remaining <= 0) {
      callFn()
    } else {
      timeout = setTimeout(callFn, remaining)
    }
  }

  return Object.assign(set, { clear })
}
