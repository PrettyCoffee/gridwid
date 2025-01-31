export const zIndex = {
  mainMenu: "z-40",
  fullscreenEditor: "z-[48]", // should be below toasts
  toast: "z-[49]",
  dialog: "z-50", // should be above toasts
  popover: "z-[998]",
  tooltip: "z-[999]",
} as const
