'use client'

import React from "react"
import { useCalendlyDialog } from "@/components/CalendlyDialogProvider"
import { trackEvent } from "@/lib/event-tracker"
import { cn } from "@/utils/cn"

interface CalendlyButtonProps {
  children: React.ReactNode
  variant?: 'solid' | 'outline'
  className?: string
  id?: string
  trackSource?: string // Section name or description of where the button is placed
}

export default function CalendlyButton({
  children,
  variant = 'solid',
  className,
  id,
  trackSource,
}: CalendlyButtonProps) {
  const { openDialog } = useCalendlyDialog()

  const handleClick = () => {
    openDialog()

    const buttonText = typeof children === 'string' ? children : 'Calendly Button'
    trackEvent('calendly_dialog_opened', {
      button_text: buttonText,
      source: trackSource || buttonText,
    }, {
      metaEventName: 'Schedule',
      customData: {
        contentName: buttonText,
        source: trackSource || buttonText,
      }
    })
  }

  const baseStyles = "px-6 py-2.5 md:px-8 md:py-4 border border-accent text-sm uppercase tracking-widest transition-colors duration-200 cursor-pointer"
  const variantStyles = variant === 'solid'
    ? "bg-accent text-background hover:bg-transparent hover:text-accent"
    : "text-accent hover:bg-accent hover:text-background"

  return (
    <button
      id={id}
      onClick={handleClick}
      className={cn(baseStyles, variantStyles, className)}
    >
      {children}
    </button>
  )
}
