// SavedViewModal — create / rename a user-saved query view. The
// query string is fixed at open-time; the modal only edits the
// human-readable name. Same chrome as other tasks dialogs.

import { useEffect, useState } from 'react'
import { Button, Dialog, Input, Text, XStack, YStack } from 'hanzogui'

export type SavedViewModalMode =
  | { kind: 'create'; query: string }
  | { kind: 'rename'; id: string; name: string }

export interface SavedViewModalProps {
  open: boolean
  mode: SavedViewModalMode | null
  onOpenChange: (next: boolean) => void
  onSubmit: (name: string) => void
}

export function SavedViewModal({ open, mode, onOpenChange, onSubmit }: SavedViewModalProps) {
  const [name, setName] = useState('')

  // Reset the input each time the dialog re-opens with a new mode.
  useEffect(() => {
    if (!open || !mode) return
    setName(mode.kind === 'rename' ? mode.name : '')
  }, [open, mode])

  if (!mode) return null

  const submitLabel = mode.kind === 'create' ? 'Save view' : 'Rename'
  const title = mode.kind === 'create' ? 'Save current view' : 'Rename saved view'
  const description =
    mode.kind === 'create'
      ? 'Saves the current filters under a name you can pick later. Stored locally per (org, namespace).'
      : 'Renames a saved view. The query is unchanged.'

  return (
    <Dialog modal open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay key="overlay" bg={'rgba(0,0,0,0.6)' as never} />
        <Dialog.Content
          bg="$background"
          borderColor="$borderColor"
          borderWidth={1}
          minW={420}
          p="$5"
          gap="$4"
        >
          <Dialog.Title fontSize="$6" fontWeight="600" color="$color">
            {title}
          </Dialog.Title>
          <Dialog.Description fontSize="$2" color="$placeholderColor">
            {description}
          </Dialog.Description>
          <YStack gap="$2">
            <Text fontSize="$2" color="$color">
              Name
            </Text>
            <Input
              value={name}
              onChangeText={setName}
              placeholder="My failing workflows"
              size="$3"
              autoFocus
            />
            {mode.kind === 'create' ? (
              <Text
                fontSize="$1"
                color="$placeholderColor"
                fontFamily={'ui-monospace, SFMono-Regular, monospace' as never}
                numberOfLines={2}
              >
                {mode.query || '(no filters)'}
              </Text>
            ) : null}
          </YStack>
          <XStack gap="$2" justify="flex-end" mt="$2">
            <Button chromeless onPress={() => onOpenChange(false)}>
              <Text fontSize="$2">Cancel</Text>
            </Button>
            <Button
              onPress={() => {
                if (!name.trim()) return
                onSubmit(name.trim())
                onOpenChange(false)
              }}
              disabled={!name.trim()}
              bg={'#f2f2f2' as never}
              hoverStyle={{ background: '#ffffff' as never }}
            >
              <Text fontSize="$2" fontWeight="500" color={'#070b13' as never}>
                {submitLabel}
              </Text>
            </Button>
          </XStack>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  )
}
