"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useEditContext } from "@/context/edit-context"

interface EditableTextProps {
  value: string
  onChange: (value: string) => void
  className?: string
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div"
  placeholder?: string
  multiline?: boolean
  html?: boolean
}

export default function EditableText({
  value,
  onChange,
  className = "",
  as = "p",
  placeholder = "Click to edit text",
  multiline = false,
  html = false,
}: EditableTextProps) {
  const { isEditMode } = useEditContext()
  const [isEditing, setIsEditing] = useState(false)
  const [text, setText] = useState(value)
  const inputRef = useRef<HTMLTextAreaElement | HTMLInputElement | HTMLDivElement>(null)

  useEffect(() => {
    setText(value)
  }, [value])

  const handleClick = () => {
    if (isEditMode && !isEditing) {
      setIsEditing(true)
    }
  }

  const handleBlur = () => {
    setIsEditing(false)
    onChange(text)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !multiline) {
      e.preventDefault()
      setIsEditing(false)
      onChange(text)
    }
    if (e.key === "Escape") {
      setIsEditing(false)
      setText(value) // Reset to original value
    }
  }

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      if ("setSelectionRange" in inputRef.current) {
        const length = inputRef.current.value.length
        inputRef.current.setSelectionRange(length, length)
      }
    }
  }, [isEditing])

  const Tag = as as keyof JSX.IntrinsicElements

  if (isEditMode && isEditing) {
    if (html) {
      return (
        <div
          ref={inputRef as React.RefObject<HTMLDivElement>}
          contentEditable
          className={`border border-primary p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${className}`}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          dangerouslySetInnerHTML={{ __html: text }}
          onInput={(e) => setText(e.currentTarget.innerHTML)}
        />
      )
    }

    if (multiline) {
      return (
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={`w-full border border-primary p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${className}`}
          placeholder={placeholder}
          rows={3}
        />
      )
    }

    return (
      <input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={`w-full border border-primary p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary ${className}`}
        placeholder={placeholder}
      />
    )
  }

  if (html) {
    return (
      <Tag
        className={`${className} ${isEditMode ? "cursor-pointer hover:ring-2 hover:ring-primary/20" : ""}`}
        onClick={handleClick}
        dangerouslySetInnerHTML={{ __html: text }}
      />
    )
  }

  return (
    <Tag
      className={`${className} ${isEditMode ? "cursor-pointer hover:ring-2 hover:ring-primary/20" : ""}`}
      onClick={handleClick}
    >
      {text || placeholder}
    </Tag>
  )
}
