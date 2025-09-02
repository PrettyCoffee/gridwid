import { Dispatch, useRef, useState } from "react"

import { Plus } from "lucide-react"

import { AutoAnimateHeight } from "components/utility/auto-animate-height"
import { cn } from "utils/cn"
import { createUuid } from "utils/create-uuid"
import { hstack } from "utils/styles"

import { Checkbox, CheckboxEditor, CheckboxProps } from "./checkbox"
import { Divider } from "../divider"
import { IconButton } from "../icon-button"
import { TextInput } from "../text-input"

type ChecklistItem = Pick<CheckboxProps, "label" | "checked"> & { id: string }

interface AddNewItemProps {
  onAdd: Dispatch<ChecklistItem>
}
const AddNewItem = ({ onAdd }: AddNewItemProps) => {
  const [label, setLabel] = useState("")

  const addItem = () => {
    onAdd({ id: createUuid(), checked: false, label })
    setLabel("")
  }

  return (
    <div className={cn(hstack({ gap: 2 }), "relative")}>
      <TextInput
        placeholder="Todo label"
        value={label}
        onChange={setLabel}
        onKeyDown={key => key === "Enter" && addItem()}
        className="pr-7.5"
      />
      <IconButton
        className="absolute top-1.25 right-1.25"
        icon={Plus}
        title="Add todo"
        onClick={addItem}
        size="sm"
        disabled={!label}
      />
    </div>
  )
}

interface ChecklistHeaderProps extends AddNewItemProps {
  title: string
  setIsAdding: Dispatch<boolean>
  isAdding: boolean
}
const ChecklistHeader = ({
  title,
  onAdd,
  isAdding,
  setIsAdding,
}: ChecklistHeaderProps) => (
  <>
    <AutoAnimateHeight duration={200} className="-m-1 p-1">
      <div>
        <div className={cn(hstack({ align: "center" }), "h-8 pb-1 pl-2")}>
          <span className="flex-1 text-lg">{title}</span>
          <IconButton
            icon={Plus}
            title="Toggle note input"
            onClick={() => setIsAdding(!isAdding)}
            size="sm"
            className={cn(
              "[&_svg]:transition [&_svg]:duration-250 [&_svg]:ease-out",
              isAdding && "[&_svg]:rotate-45 [&_svg]:scale-125",
              !isAdding &&
                "[[data-checklist]:not(:hover,:focus-within)_&]:hidden"
            )}
          />
        </div>
        {isAdding && (
          <div className="pt-1 pb-2">
            <AddNewItem onAdd={onAdd} />
          </div>
        )}
      </div>
    </AutoAnimateHeight>
    <Divider className="my-2" color="gentle" />
  </>
)

interface ChecklistProps {
  title: string
  items: ChecklistItem[]
  onChange: Dispatch<ChecklistItem[]>
}
export const Checklist = ({ title, items, onChange }: ChecklistProps) => {
  const [isAdding, setIsAdding] = useState(false)

  const [editing, setEditing] = useState<string>()
  const prevEditing = useRef(editing)

  const startEditing = (id: string) => setEditing(id)

  const stopEditing = () => {
    setEditing(undefined)
    prevEditing.current = undefined
  }

  const handleChange = (data: Partial<ChecklistItem>) => {
    onChange(
      items.map(item => (item.id !== data.id ? item : { ...item, ...data }))
    )
  }

  return (
    <div data-checklist className={cn()}>
      <ChecklistHeader
        title={title}
        onAdd={item => onChange([...items, item])}
        isAdding={isAdding}
        setIsAdding={setIsAdding}
      />
      <ul className="space-y-1">
        {items.map(({ id, label, checked }) =>
          editing === id ? (
            <li key={id}>
              <CheckboxEditor
                textInputRef={element => {
                  if (!element) return
                  if (id !== prevEditing.current) {
                    element.focus()
                    element.select()
                    prevEditing.current = id
                  }
                }}
                onBlur={stopEditing}
                placeholder="Start typing..."
                label={label}
                onLabelChange={label => handleChange({ id, label })}
                checked={checked}
                onCheckedChange={checked => handleChange({ id, checked })}
              />
            </li>
          ) : (
            <li key={id}>
              <Checkbox
                onDoubleClick={() => startEditing(id)}
                label={label}
                checked={checked}
                onCheckedChange={checked => handleChange({ id, checked })}
              />
            </li>
          )
        )}
      </ul>
    </div>
  )
}
