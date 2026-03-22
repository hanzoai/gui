import type React from 'react'

export function GuiRoot(props: {
  children: React.ReactNode
  trackMount?: boolean
  style?: any
}) {
  return props.children
}
