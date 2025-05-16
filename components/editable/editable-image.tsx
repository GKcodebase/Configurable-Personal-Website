"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useEditContext } from "@/context/edit-context"
import { Camera, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EditableImageProps {
  src: string
  alt: string
  onChange: (src: string) => void
  className?: string
  width?: number
  height?: number
}

export default function EditableImage({ src, alt, onChange, className = "", width, height }: EditableImageProps) {
  const { isEditMode } = useEditContext()
  const [isHovering, setIsHovering] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageClick = () => {
    if (isEditMode && fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      if (event.target?.result) {
        onChange(event.target.result as string)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange("/placeholder.svg?height=400&width=400")
  }

  return (
    <div
      className={`relative ${className} ${isEditMode ? "cursor-pointer" : ""}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={handleImageClick}
    >
      <img
        src={src || "/placeholder.svg"}
        alt={alt}
        className={`object-cover ${isEditMode && isHovering ? "opacity-70" : ""}`}
        width={width}
        height={height}
      />

      {isEditMode && isHovering && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <Camera className="h-10 w-10 text-white" />
          {src !== "/placeholder.svg?height=400&width=400" && (
            <Button variant="destructive" size="icon" className="absolute top-2 right-2" onClick={handleRemoveImage}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}

      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
    </div>
  )
}
