// Configurable table headers drawer — generic over a TableColumn[]
// descriptor. Slides in from the right, lists every available column
// with a checkbox, persists the user's choice via the table-columns
// store. Tier 1A (workflows / schedules / batches) and Tier 1B
// (activities) drop in <ColumnSettingsButton storageKey={…}
// columns={…}/> next to their table header — that button mounts this
// drawer.
//
// Implementation notes:
//   - hanzogui doesn't yet export a Drawer primitive; we mirror the
//     same fixed-position YStack pattern used by ActionDialog so the
//     visual language stays consistent with the rest of admin-tasks.
//   - Native checkboxes + label rows; no a11y libraries needed.
//   - "Reset" wipes localStorage and falls back to descriptor defaults.
//   - "Select all" / "Clear" are explicit so a user with 12 columns
//     doesn't have to click 12 times.

import { useEffect } from 'react'
import { Button, Card, H3, Text, XStack, YStack } from 'hanzogui'
import { X } from '@hanzogui/lucide-icons-2/icons/X'
import type { TableColumn } from '../../lib/types'
import { useTableColumns, type UseTableColumns } from '../../stores/table-columns'

export interface ConfigurableTableHeadersDrawerProps {
  open: boolean
  onClose: () => void
  storageKey: string
  columns: TableColumn[]
  // Optional title — defaults to "Columns".
  title?: string
}

export function ConfigurableTableHeadersDrawer({
  open,
  onClose,
  storageKey,
  columns,
  title = 'Columns',
}: ConfigurableTableHeadersDrawerProps) {
  const ctrl = useTableColumns(storageKey, columns)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <YStack
      position="absolute"
      t={0}
      l={0}
      r={0}
      b={0}
      bg={'rgba(0,0,0,0.45)' as never}
      z={1000}
      style={{ position: 'fixed' as never }}
      onPress={onClose}
      items="flex-end"
    >
      <Card
        width={360}
        height={'100%' as never}
        p="$4"
        gap="$3"
        bg="$background"
        borderColor="$borderColor"
        borderLeftWidth={1}
        borderRightWidth={0}
        borderTopWidth={0}
        borderBottomWidth={0}
        rounded={0 as never}
        onPress={(e: { stopPropagation: () => void }) => e.stopPropagation()}
      >
        <XStack items="center" justify="space-between">
          <H3 size="$5" color="$color" fontWeight="500">
            {title}
          </H3>
          <Button
            size="$2"
            chromeless
            onPress={onClose}
            aria-label="Close columns drawer"
          >
            <X size={14} color="#7e8794" />
          </Button>
        </XStack>

        <Text fontSize="$1" color="$placeholderColor">
          Choose which columns appear in this table. The setting is stored
          locally to this browser.
        </Text>

        <DrawerToolbar ctrl={ctrl} />

        <YStack gap="$1" flex={1} overflow={'scroll' as never}>
          {columns.map((col) => (
            <CheckboxRow
              key={col.key}
              column={col}
              checked={ctrl.isVisible(col.key)}
              onToggle={() => ctrl.toggle(col.key)}
            />
          ))}
        </YStack>
      </Card>
    </YStack>
  )
}

function DrawerToolbar({ ctrl }: { ctrl: UseTableColumns }) {
  const allKeys = ctrl.all.map((c) => c.key)
  const allOn = ctrl.visible.length === ctrl.all.length
  return (
    <XStack gap="$2" flexWrap="wrap">
      <Button
        size="$2"
        chromeless
        onPress={() => ctrl.setVisible(allOn ? [allKeys[0]] : allKeys)}
      >
        <Text fontSize="$2" color={'#86efac' as never}>
          {allOn ? 'Clear' : 'Select all'}
        </Text>
      </Button>
      <Button size="$2" chromeless onPress={ctrl.reset}>
        <Text fontSize="$2" color="$placeholderColor">
          Reset to defaults
        </Text>
      </Button>
    </XStack>
  )
}

function CheckboxRow({
  column,
  checked,
  onToggle,
}: {
  column: TableColumn
  checked: boolean
  onToggle: () => void
}) {
  // Native <label>/<input> — keeps focus + a11y semantics correct
  // without pulling in another component. The hover/active state is
  // handled by the wrapping XStack so the click target spans the row.
  return (
    <XStack
      items="center"
      gap="$2"
      px="$2"
      py="$2"
      rounded="$2"
      hoverStyle={{ background: 'rgba(255,255,255,0.04)' as never }}
      cursor={'pointer' as never}
      onPress={onToggle}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onToggle}
        onClick={(e) => e.stopPropagation()}
        aria-label={column.label}
        style={{ cursor: 'pointer' }}
      />
      <Text fontSize="$2" color="$color" flex={1}>
        {column.label}
      </Text>
      {column.default ? (
        <Text fontSize="$1" color="$placeholderColor">
          default
        </Text>
      ) : null}
    </XStack>
  )
}
