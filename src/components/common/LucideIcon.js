import React from 'react'
import { icons } from 'lucide-react'

export default function LucideIcon({
  name,
  color,
  size,
  wrap,
  filledClass,
  onClick
}) {
  const Icon = icons[name]
  if (!Icon) {
    console.error(`Icon "${name}" does not exist in lucide-react.`)
    return null
  }

  return (
    <>
      {wrap ? (
        <div className={`flex items-center ${wrap}`}>
          <Icon
            className={filledClass}
            color={color}
            size={size}
            onClick={onClick}
          />
        </div>
      ) : (
        <Icon
          className={filledClass}
          color={color}
          size={size}
          onClick={onClick}
        />
      )}
    </>
  )
}
