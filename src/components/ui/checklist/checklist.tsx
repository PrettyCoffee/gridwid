import { Dispatch, useState } from "react"

import { Pen, Plus, X } from "lucide-react"

import { Checkbox, CheckboxEditor, CheckboxProps } from "components/ui/checkbox"
import { Divider } from "components/ui/divider"
import { IconButton } from "components/ui/icon-button"
import { TextInput } from "components/ui/text-input"
import { AutoAnimateHeight } from "components/utility/auto-animate-height"
import { cn } from "utils/cn"
import { createUuid } from "utils/create-uuid"
import { hstack } from "utils/styles"

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
  setIsEditing: Dispatch<boolean>
  isEditing: boolean
}
const ChecklistHeader = ({
  title,
  onAdd,
  isEditing,
  setIsEditing,
}: ChecklistHeaderProps) => (
  <>
    <AutoAnimateHeight duration={200} className="-m-1 p-1">
      <div>
        <div className={cn(hstack({ align: "center" }), "h-8 pb-1 pl-2")}>
          <span className="flex-1 text-lg">{title}</span>
          <IconButton
            icon={isEditing ? X : Pen}
            title="Toggle editing"
            onClick={() => setIsEditing(!isEditing)}
            size="sm"
            className={cn(
              !isEditing &&
                "[[data-checklist]:not(:hover,:focus-within)_&]:hidden"
            )}
          />
        </div>
        {isEditing && (
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
  const [isEditing, setIsEditing] = useState(false)

  const handleChange = (data: Partial<ChecklistItem>) => {
    onChange(
      items.map(item => (item.id !== data.id ? item : { ...item, ...data }))
    )
  }

  return (
    <div data-checklist>
      <ChecklistHeader
        title={title}
        onAdd={item => onChange([...items, item])}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
      />
      <ul className="space-y-1">
        {items.map(({ id, label, checked }) =>
          isEditing ? (
            <li key={id}>
              <CheckboxEditor
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
