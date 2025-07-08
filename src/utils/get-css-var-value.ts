export const getCssVarValue = (varName: string) =>
  window
    .getComputedStyle(window.document.documentElement)
    .getPropertyValue(varName)
