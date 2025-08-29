import { Dispatch, useState } from "react"

import { Plus } from "lucide-react"

import { Checkbox, CheckboxEditor, CheckboxProps } from "components/ui/checkbox"
import { AutoAnimateHeight } from "components/utility/auto-animate-height"
import { cn } from "utils/cn"
import { createUuid } from "utils/create-uuid"
import { hstack } from "utils/styles"

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
}
const ChecklistHeader = ({ title, onAdd }: ChecklistHeaderProps) => {
  const [allowAdding, setAllowAdding] = useState(false)

  return (
    <>
      <AutoAnimateHeight duration={200} className="-m-1 p-1">
        <div>
          <div className={cn(hstack({ align: "center" }), "pb-1 pl-2")}>
            <span className="flex-1 text-lg">{title}</span>
            <IconButton
              icon={Plus}
              title="Toggle note input"
              onClick={() => setAllowAdding(!allowAdding)}
              size="sm"
              className={cn(
                "[&_svg]:transition [&_svg]:duration-250 [&_svg]:ease-out",
                allowAdding && "[&_svg]:rotate-45 [&_svg]:scale-125"
              )}
            />
          </div>
          {allowAdding && (
            <div className="pt-1 pb-2">
              <AddNewItem onAdd={onAdd} />
            </div>
          )}
        </div>
      </AutoAnimateHeight>
      <Divider className="my-2" color="gentle" />
    </>
  )
}

interface ChecklistProps {
  title: string
  items: ChecklistItem[]
  onChange: Dispatch<ChecklistItem[]>
}
export const Checklist = ({ title, items, onChange }: ChecklistProps) => {
  const [isEditing, setIsEditing] = useState<string>()

  const handleChange = (data: Partial<ChecklistItem>) => {
    onChange(
      items.map(item => (item.id !== data.id ? item : { ...item, ...data }))
    )
  }

  return (
    <div className={cn()}>
      <ChecklistHeader
        title={title}
        onAdd={item => onChange([...items, item])}
      />
      <ul className="space-y-1">
        {items.map(({ id, label, checked }) =>
          isEditing === id ? (
            <li key={id}>
              <CheckboxEditor
                onBlur={() => setIsEditing(undefined)}
                placeholder="Start typing..."
                label={label}
                onLabelChange={label => handleChange({ id, label })}
                checked={checked}
                onCheckedChange={checked => handleChange({ id, checked })}
                textInputRef={element => {
                  if (!element) return
                  element.focus()
                  element.select()
                }}
              />
            </li>
          ) : (
            <li key={id}>
              <Checkbox
                onDoubleClick={() => setIsEditing(id)}
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
