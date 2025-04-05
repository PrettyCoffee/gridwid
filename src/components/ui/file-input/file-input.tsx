import { ChangeEvent, useState, DragEvent, useId } from "react"

import { Upload } from "lucide-react"

import { AlertKind, ClassNameProp } from "../../../types/base-props"
import { cn } from "../../../utils/cn"
import {
  alertStyles,
  focusRing,
  hstack,
  interactive,
} from "../../../utils/styles"
import { Icon } from "../icon"
import { TitleTooltip } from "../tooltip"

interface FileInputProps extends ClassNameProp {
  label?: string
  alert?: { kind: AlertKind; text: string }
  onChange?: (value: File) => void
}

export const FileInput = ({
  label,
  onChange,
  alert,
  className,
}: FileInputProps) => {
  const id = useId()
  const [dragging, setDragging] = useState(false)

  const addDrag = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setDragging(true)
  }

  const removeDrag = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setDragging(false)
  }

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setDragging(false)
    const file = event.dataTransfer.items[0]?.getAsFile()
    if (file) onChange?.(file)
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) onChange?.(file)
  }

  return (
    <TitleTooltip title={alert?.text} side="bottom" asChild>
      <div
        className="inline-block"
        onDrop={handleDrop}
        onDragOver={addDrag}
        onDragLeave={removeDrag}
      >
        <input
          type="file"
          id={id}
          className="sr-only"
          onChange={handleChange}
        />
        <label
          htmlFor={id}
          className={cn(
            hstack({ gap: 2, align: "center", justify: "center" }),
            interactive({ look: "flat" }),
            focusRing,
            "cursor-pointer rounded-md p-6",
            "border-stroke border-2 border-dashed [*:focus-visible+&]:outline",
            alert && alert.kind !== "info" && alertStyles[alert.kind].border,
            dragging && "border-stroke-focus bgl-layer-w/10",
            className
          )}
        >
          <Icon icon={Upload} color="current" />
          {label}
          {alert && (
            <Icon icon={alertStyles[alert.kind].icon} color={alert.kind} />
          )}
        </label>
      </div>
    </TitleTooltip>
  )
}
