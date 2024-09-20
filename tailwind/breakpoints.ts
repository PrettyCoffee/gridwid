export const breakpoints = {
  mobile: 550,
  tablet: 1100,
  laptop: 1500,
  desktop: 9999,
}

export const screens = Object.fromEntries(
  Object.entries(breakpoints).map(([name, value]) => [
    name,
    { max: `${value}px` },
  ])
)
