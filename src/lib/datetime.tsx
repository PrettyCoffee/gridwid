const SECOND = 1000
const MINUTE = SECOND * 60
const HOUR = MINUTE * 60
const DAY = HOUR * 24
const WEEK = DAY * 7

export const tomorrow = () => {
  const date = new Date()
  date.setDate(date.getDate() + 1)
  date.setHours(0)
  date.setMinutes(0)
  date.setSeconds(0)
  date.setMilliseconds(0)
  return date
}

const formatter = new Intl.RelativeTimeFormat("en", {
  numeric: "auto",
  style: "long",
  localeMatcher: "best fit",
})

export const timeSince = (pushedAt: string) => {
  const date = new Date(pushedAt)

  const diff = date.valueOf() - Date.now()
  if (diff > -1 * WEEK) {
    return formatter.format(Math.round(diff / DAY), "day")
  }
  if (diff > -5 * WEEK) {
    return formatter.format(Math.round(diff / WEEK), "week")
  }
  return date.toLocaleDateString()
}
