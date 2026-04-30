// VersionActionsMenu — per-row menu for a deployment version. Set current is
// disabled when this row is already current; Delete is disabled when this
// row is current (you can't delete the active version). All write items
// are gated by `writeDisabled` (capability flag).

import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Card, Text, XStack, YStack } from 'hanzogui'

export interface VersionActionsMenuProps {
  buildId: string
  editHref: string
  isCurrent: boolean
  writeDisabled?: boolean
  onSetCurrent: () => void
  onValidate: () => void
  onDelete: () => void
}

export function VersionActionsMenu({
  buildId,
  editHref,
  isCurrent,
  writeDisabled,
  onSetCurrent,
  onValidate,
  onDelete,
}: VersionActionsMenuProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      if (!ref.current) return
      if (!ref.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <YStack
      ref={ref as never}
      position="relative"
      style={{ position: 'relative' as never }}
    >
      <Button
        size="$2"
        chromeless
        onPress={() => setOpen((v) => !v)}
        aria-label={`Actions for ${buildId}`}
        aria-expanded={open}
      >
        <Text fontSize="$2" color="$color">
          ⋮
        </Text>
      </Button>
      {open ? (
        <Card
          position="absolute"
          t={32}
          r={0}
          minW={200}
          z={500}
          bg="$background"
          borderColor="$borderColor"
          borderWidth={1}
          p="$1"
          style={{ position: 'absolute' as never }}
        >
          <Link
            to={editHref}
            style={{ textDecoration: 'none', color: 'inherit' }}
            onClick={() => setOpen(false)}
          >
            <MenuItem disabled={writeDisabled}>Edit</MenuItem>
          </Link>
          <MenuItem
            disabled={writeDisabled || isCurrent}
            onPress={() => {
              setOpen(false)
              onSetCurrent()
            }}
          >
            Set as current
          </MenuItem>
          <MenuItem
            disabled={writeDisabled}
            onPress={() => {
              setOpen(false)
              onValidate()
            }}
          >
            Validate connection
          </MenuItem>
          <MenuItem
            disabled={writeDisabled || isCurrent}
            destructive
            onPress={() => {
              setOpen(false)
              onDelete()
            }}
          >
            Delete
          </MenuItem>
        </Card>
      ) : null}
    </YStack>
  )
}

function MenuItem({
  children,
  onPress,
  disabled,
  destructive,
}: {
  children: React.ReactNode
  onPress?: () => void
  disabled?: boolean
  destructive?: boolean
}) {
  return (
    <XStack
      px="$3"
      py="$2"
      cursor={disabled ? 'not-allowed' : 'pointer'}
      hoverStyle={
        disabled
          ? undefined
          : { background: 'rgba(255,255,255,0.04)' as never }
      }
      opacity={disabled ? 0.4 : 1}
      onPress={() => (disabled ? undefined : onPress?.())}
    >
      <Text
        fontSize="$2"
        color={destructive ? ('#fca5a5' as never) : '$color'}
      >
        {children}
      </Text>
    </XStack>
  )
}
