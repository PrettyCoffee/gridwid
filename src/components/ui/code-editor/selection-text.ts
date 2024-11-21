const isNumber = (value?: unknown): value is number =>
  typeof value === "number" && !isNaN(value)

export class SelectionText {
  private readonly element: HTMLTextAreaElement
  private value: string

  public start: number
  public end: number

  constructor(element: HTMLTextAreaElement) {
    const { selectionStart, selectionEnd } = element
    this.element = element
    this.start = selectionStart
    this.end = selectionEnd
    this.value = this.element.value
  }

  public position(start?: number, end?: number) {
    const { selectionStart, selectionEnd, selectionDirection } = this.element
    this.start = isNumber(start) ? start : selectionStart
    this.end = isNumber(end) ? end : selectionEnd
    if (selectionDirection === "forward") {
      this.element.selectionStart = this.start
      this.element.selectionEnd = this.end
    } else {
      this.element.selectionEnd = this.end
      this.element.selectionStart = this.start
    }
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
    const value = this.value
    let start = this.start
    do {
      start--
    } while (value.charAt(start) !== "\n" && start > 0)
    return start
  }

  private getLineEndNumber() {
    const value = this.value
    let end = this.end
    while (value.charAt(end) !== "\n" && end < value.length) {
      end++
    }
    return end
  }

  public getIndentText() {
    const start = this.getLineStartNumber()
    const str = this.getSelectedValue(start)
    let indent = ""
    str.replace(/(^(\s)+)/, (_match, old) => (indent = String(old)))
    return indent
  }

  public lineStartInsert(insert: string) {
    const lineStart = this.getLineStartNumber()
    const selectedValue = this.getSelectedValue(lineStart)

    const newStart = this.start + insert.length

    this.position(lineStart, this.end)
    this.insertText(
      selectedValue
        .split("\n")
        .map(line => insert + line)
        .join("\n")
    )
    this.position(newStart, this.end)

    return this
  }

  public lineStartRemove(remove: string) {
    const lineStart = this.getLineStartNumber()
    const selectedValue = this.getSelectedValue(lineStart)

    const removeRegex = new RegExp(`^${remove}`, "g")
    const newStart = !removeRegex.test(selectedValue)
      ? this.start
      : this.start - remove.length

    this.position(lineStart, this.end)
    this.insertText(
      selectedValue
        .split("\n")
        .map(line => line.replace(removeRegex, ""))
        .join("\n")
    )
    this.position(newStart, this.end)

    return this
  }

  public deleteLines() {
    const lineStart = this.getLineStartNumber()
    const lineEnd = this.getLineEndNumber()

    this.position(lineStart, lineEnd)
    this.insertText("")
    this.position(lineStart + 1, lineStart + 1)
  }

  public notifyChange() {
    const event = new Event("input", { bubbles: true, cancelable: false })
    this.element.dispatchEvent(event)
  }
}
