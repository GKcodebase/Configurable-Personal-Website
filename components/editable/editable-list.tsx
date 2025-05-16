"use client"

import type React from "react"

import { useState } from "react"
import { useEditContext } from "@/context/edit-context"
import { Plus, Minus, Edit, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface EditableListProps {
  items: string[]
  onChange: (items: string[]) => void
  className?: string
  itemClassName?: string
  addLabel?: string
}

export default function EditableList({
  items,
  onChange,
  className = "",
  itemClassName = "",
  addLabel = "Add item",
}: EditableListProps) {
  const { isEditMode } = useEditContext()
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editingValue, setEditingValue] = useState("")
  const [newItem, setNewItem] = useState("")
  const [isAddingNew, setIsAddingNew] = useState(false)

  const handleEdit = (index: number) => {
    setEditingIndex(index)
    setEditingValue(items[index])
  }

  const handleSave = () => {
    if (editingIndex !== null) {
      const newItems = [...items]
      newItems[editingIndex] = editingValue
      onChange(newItems)
      setEditingIndex(null)
      setEditingValue("")
    }
  }

  const handleRemove = (index: number) => {
    const newItems = items.filter((_, i) => i !== index)
    onChange(newItems)
  }

  const handleAddNew = () => {
    if (newItem.trim()) {
      onChange([...items, newItem.trim()])
      setNewItem("")
      setIsAddingNew(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (editingIndex !== null) {
        handleSave()
      } else if (isAddingNew) {
        handleAddNew()
      }
    } else if (e.key === "Escape") {
      setEditingIndex(null)
      setEditingValue("")
      setIsAddingNew(false)
      setNewItem("")
    }
  }

  return (
    <div className={className}>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index} className={`flex items-center gap-2 ${itemClassName}`}>
            {isEditMode && editingIndex === index ? (
              <div className="flex items-center gap-2 w-full">
                <Input
                  value={editingValue}
                  onChange={(e) => setEditingValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1"
                  autoFocus
                />
                <Button size="icon" variant="ghost" onClick={handleSave}>
                  <Save className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <>
                <span className="flex-1">{item}</span>
                {isEditMode && (
                  <div className="flex items-center gap-1">
                    <Button size="icon" variant="ghost" onClick={() => handleEdit(index)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => handleRemove(index)}>
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </li>
        ))}
      </ul>

      {isEditMode && (
        <div className="mt-2">
          {isAddingNew ? (
            <div className="flex items-center gap-2">
              <Input
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={addLabel}
                className="flex-1"
                autoFocus
              />
              <Button size="sm" onClick={handleAddNew}>
                Add
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setIsAddingNew(false)}>
                Cancel
              </Button>
            </div>
          ) : (
            <Button variant="outline" size="sm" className="mt-2" onClick={() => setIsAddingNew(true)}>
              <Plus className="h-4 w-4 mr-2" />
              {addLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
