const isNumber = (value?: unknown): value is number =>
  typeof value === "number" && !isNaN(value)

export class SelectionText {
  private readonly element: HTMLTextAreaElement
  private value: string

  public start: number
  public end: number

  constructor(elm: HTMLTextAreaElement) {
    const { selectionStart, selectionEnd } = elm
    this.element = elm
    this.start = selectionStart
    this.end = selectionEnd
    this.value = this.element.value
  }

  public position(start?: number, end?: number) {
    const { selectionStart, selectionEnd } = this.element
    this.start = isNumber(start) ? start : selectionStart
    this.end = isNumber(end) ? end : selectionEnd
    this.element.selectionStart = this.start
    this.element.selectionEnd = this.end
    return this
  }

  public insertText(text: string) {
    // Most of the used APIs only work with the field selected
    this.element.focus()
    this.element.setRangeText(text)
    this.value = this.element.value
    this.position()
    return this
  }

  public getSelectedValue(start?: number, end?: number) {
    const { selectionStart, selectionEnd } = this.element
    return this.value.slice(
      isNumber(start) ? start : selectionStart,
      isNumber(end) ? end : selectionEnd
    )
  }

  private getLineStartNumber() {
    let start = this.start
    while (start > 0) {
      start--
      if (this.value.charAt(start) === "\n") {
        start++
        break
      }
    }
    return start
  }

  public getIndentText() {
    const start = this.getLineStartNumber()
    const str = this.getSelectedValue(start)
    let indent = ""
    str.replace(/(^(\s)+)/, (_match, old) => (indent = String(old)))
    return indent
  }

  public lineStartInsert(text: string) {
    if (text) {
      const oldStart = this.start
      const start = this.getLineStartNumber()
      const str = this.getSelectedValue(start)
      this.position(start, this.end)
        .insertText(
          str
            .split("\n")
            .map(txt => text + txt)
            .join("\n")
        )
        .position(oldStart + text.length, this.end)
    }
    return this
  }

  public lineStartRemove(text: string) {
    if (text) {
      const oldStart = this.start
      const start = this.getLineStartNumber()
      const str = this.getSelectedValue(start)
      const reg = new RegExp(`^${text}`, "g")
      let newStart = oldStart - text.length
      if (!reg.test(str)) {
        newStart = oldStart
      }
      this.position(start, this.end)
        .insertText(
          str
            .split("\n")
            .map(txt => txt.replace(reg, ""))
            .join("\n")
        )
        .position(newStart, this.end)
    }
  }

  public notifyChange() {
    const event = new Event("input", { bubbles: true, cancelable: false })
    this.element.dispatchEvent(event)
  }
}
