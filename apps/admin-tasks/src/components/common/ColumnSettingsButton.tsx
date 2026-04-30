// ColumnSettingsButton — the cog-icon trigger that opens the
// ConfigurableTableHeadersDrawer. Drop next to any table header that
// wants per-column visibility:
//
//   <ColumnSettingsButton storageKey="workflows" columns={WORKFLOW_COLUMNS} />
//
// The button is presentational; persistence + state live in the drawer
// + the table-columns store. Keeping the trigger tiny makes it cheap
// to embed in a tight toolbar.

import { useState } from 'react'
import { Button, XStack } from 'hanzogui'
import { Settings2 } from '@hanzogui/lucide-icons-2/icons/Settings2'
import type { TableColumn } from '../../lib/types'
import { ConfigurableTableHeadersDrawer } from './ConfigurableTableHeadersDrawer'

export interface ColumnSettingsButtonProps {
  storageKey: string
  columns: TableColumn[]
  title?: string
}

export function ColumnSettingsButton({
  storageKey,
  columns,
  title,
}: ColumnSettingsButtonProps) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button
        size="$2"
        borderWidth={1}
        borderColor="$borderColor"
        onPress={() => setOpen(true)}
        aria-label="Configure columns"
      >
        <XStack items="center" gap="$1.5">
          <Settings2 size={14} color="#7e8794" />
        </XStack>
      </Button>
      <ConfigurableTableHeadersDrawer
        open={open}
        onClose={() => setOpen(false)}
        storageKey={storageKey}
        columns={columns}
        title={title}
      />
    </>
  )
}
