interface Position {
  start: number
  end: number
  direction: HTMLTextAreaElement["selectionDirection"]
}

class TextCursor {
  private readonly element: HTMLTextAreaElement

  private position: Position

  constructor(element: HTMLTextAreaElement) {
    this.element = element
    this.position = {
      start: element.selectionStart,
      end: element.selectionEnd,
      direction: element.selectionDirection,
    }
  }

  public getPosition() {
    return { ...this.position }
  }

  public setPosition(positionArg: number | Partial<Position>) {
    const { selectionStart, selectionEnd, selectionDirection } = this.element
    this.position =
      typeof positionArg == "number"
        ? { start: positionArg, end: positionArg, direction: "forward" }
        : {
            start: positionArg.start ?? selectionStart,
            end: positionArg.end ?? selectionEnd,
            direction: positionArg.direction ?? selectionDirection,
          }

    if (this.position.direction === "forward") {
      this.element.selectionStart = this.position.start
      this.element.selectionEnd = this.position.end
    } else {
      this.element.selectionEnd = this.position.end
      this.element.selectionStart = this.position.start
    }
  }

  public insertText(text: string) {
    // Most of the used APIs only work with the field selected
    this.element.focus()
    this.element.setRangeText(text)
    this.setPosition({})
    return this.element.value
  }

  public getSelectedValue(position?: Partial<Omit<Position, "direction">>) {
    return this.element.value.slice(
      position?.start ?? this.position.start,
      position?.end ?? this.position.end
    )
  }

  public getLineStart() {
    const value = this.element.value
    let start = this.position.start
    do {
      start--
    } while (value.charAt(start) !== "\n" && start > 0)
    return start + 1
  }

  public getLineEnd() {
    const value = this.element.value
    let end = this.position.end
    while (value.charAt(end) !== "\n" && end < value.length) {
      end++
    }
    return end
  }
}

export class SelectionText {
  private readonly element: HTMLTextAreaElement

  public readonly cursor: TextCursor

  constructor(element: HTMLTextAreaElement) {
    this.element = element
    this.cursor = new TextCursor(element)
  }

  public getLineIndentation() {
    const lineStart = this.cursor.getLineStart()
    const selectedValue = this.cursor.getSelectedValue({ start: lineStart })
    const [, indent] = selectedValue.match(/(^(\s)+)/) ?? []
    return indent ?? ""
  }

  public lineStartInsert(insert: string) {
    const position = this.cursor.getPosition()
    const lineStart = this.cursor.getLineStart()
    const selectedValue = this.cursor.getSelectedValue({ start: lineStart })

    const newStart = position.start + insert.length

    this.cursor.setPosition({ start: lineStart })
    this.cursor.insertText(
      selectedValue
        .split("\n")
        .map(line => insert + line)
        .join("\n")
    )
    this.cursor.setPosition({ start: newStart })

    return this
  }

  public lineStartRemove(remove: string) {
    const position = this.cursor.getPosition()
    const lineStart = this.cursor.getLineStart()
    const selectedValue = this.cursor.getSelectedValue({ start: lineStart })

    const removeRegex = new RegExp(`^${remove}`, "g")
    const newStart = !removeRegex.test(selectedValue)
      ? position.start
      : position.start - remove.length

    this.cursor.setPosition({ start: lineStart })
    this.cursor.insertText(
      selectedValue
        .split("\n")
        .map(line => line.replace(removeRegex, ""))
        .join("\n")
    )
    this.cursor.setPosition({ start: newStart })

    return this
  }

  public deleteLines() {
    const position = this.cursor.getPosition()
    const removedValue = this.cursor.getSelectedValue()
    const lineStart = this.cursor.getLineStart()
    const lineEnd = this.cursor.getLineEnd()

    this.cursor.setPosition({ start: lineStart - 1, end: lineEnd })
    this.cursor.insertText("")

    // multi line deletion moves cursor to line start
    if (removedValue.includes("\n")) {
      this.cursor.setPosition(lineStart)
      return
    }

    const newValue = this.element.value
    // if single line deletion can keep cursor position, do that
    if (!newValue.slice(lineStart, position.start).includes("\n")) {
      this.cursor.setPosition(position.start)
    } else {
      // otherwise, move it to the end of the line
      this.cursor.setPosition(lineStart)
      const newLineEnd = this.cursor.getLineEnd()
      this.cursor.setPosition(newLineEnd)
    }
  }

  public duplicateLines() {
    const position = this.cursor.getPosition()
    const lineStart = this.cursor.getLineStart()
    const lineEnd = this.cursor.getLineEnd()

    const duplicateValue = this.cursor.getSelectedValue({
      start: lineStart - 1,
      end: lineEnd,
    })
    this.cursor.setPosition(lineEnd)
    this.cursor.insertText(duplicateValue)

    const positionOffset = duplicateValue.length
    this.cursor.setPosition({
      start: position.start + positionOffset,
      end: position.end + positionOffset,
    })
  }

  public moveLines(direction: number) {
    const position = this.cursor.getPosition()
    const lineStart = this.cursor.getLineStart()
    const lineEnd = this.cursor.getLineEnd()

    const movedText = this.cursor.getSelectedValue({
      start: lineStart,
      end: lineEnd + 1,
    })

    this.cursor.setPosition({ start: lineStart, end: lineEnd + 1 })
    this.cursor.insertText("")

    const oldPosition = this.cursor.getPosition().start
    let newPosition: number

    if (direction < 0) {
      this.cursor.setPosition(this.cursor.getLineStart() - 1) // start of the line
      this.cursor.setPosition(this.cursor.getLineStart()) // start of the line above
      newPosition = this.cursor.getPosition().start
      this.cursor.insertText(movedText)
    } else {
      this.cursor.setPosition(this.cursor.getLineEnd() + 1) // start of the line below
      newPosition = this.cursor.getPosition().start
      this.cursor.insertText(movedText)
    }

    const diff = newPosition - oldPosition
    this.cursor.setPosition({
      ...position,
      start: position.start + diff,
      end: position.end + diff,
    })
  }

  public notifyChange() {
    const event = new Event("input", { bubbles: true, cancelable: false })
    this.element.dispatchEvent(event)
  }
}
