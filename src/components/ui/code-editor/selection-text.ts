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
    return start + 1
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
    const lineStart = this.getLineStartNumber()
    const selectedValue = this.getSelectedValue(lineStart)
    const [, indent] = selectedValue.match(/(^(\s)+)/) ?? []
    return indent ?? ""
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
    const removedValue = this.getSelectedValue()
    const cursorPosition = this.start
    const lineStart = this.getLineStartNumber()
    const lineEnd = this.getLineEndNumber()

    this.position(lineStart - 1, lineEnd)
    this.insertText("")

    // multi line deletion moves cursor to line start
    if (removedValue.includes("\n")) {
      this.position(lineStart, lineStart)
      return
    }

    const newValue = this.element.value
    // if single line deletion can keep cursor position, do that
    if (!newValue.slice(lineStart, cursorPosition).includes("\n")) {
      this.position(cursorPosition, cursorPosition)
    } else {
      // otherwise, move it to the end of the line
      this.position(lineStart, lineStart)
      const newLineEnd = this.getLineEndNumber()
      this.position(newLineEnd, newLineEnd)
    }
  }

  public notifyChange() {
    const event = new Event("input", { bubbles: true, cancelable: false })
    this.element.dispatchEvent(event)
  }
}
