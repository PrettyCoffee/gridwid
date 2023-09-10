const SECOND = 1000
const MINUTE = SECOND * 60
const HOUR = MINUTE * 60
const DAY = HOUR * 24

export const tomorrow = () => {
  const date = new Date()
  date.setDate(date.getDate() + 1)
  date.setHours(0)
  date.setMinutes(0)
  date.setSeconds(0)
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
  if (diff > MINUTE * -15) {
    return formatter.format(Math.round(diff / MINUTE), "minute")
  }
  if (diff > HOUR * -12) {
    return formatter.format(Math.round(diff / HOUR), "hour")
  }
  if (diff > DAY * -7) {
    return formatter.format(Math.round(diff / DAY), "day")
  }
  return date.toLocaleDateString()
}
