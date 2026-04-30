// BulkConfirmDialog — generic "are you sure?" dialog for bulk
// workflow operations. The parent picks the title/copy/destructive
// flag; this component only owns the modal chrome, the reason
// textarea, and submit/cancel wiring.

import { useState } from 'react'
import { Button, Dialog, Input, Spinner, Text, XStack, YStack } from 'hanzogui'
import { Alert } from '@hanzogui/admin'

export interface BulkConfirmDialogProps {
  open: boolean
  onOpenChange: (next: boolean) => void
  title: string
  description: string
  // Confirm button label, e.g. "Cancel selected", "Terminate".
  confirmLabel: string
  // When true, the confirm button renders red.
  destructive?: boolean
  // Reason field config. Required by upstream Temporal for
  // terminate/reset; optional otherwise.
  reasonRequired?: boolean
  reasonLabel?: string
  // Called with the trimmed reason on submit. Returning a rejected
  // promise keeps the dialog open and surfaces the error inline.
  onSubmit: (reason: string) => Promise<void>
}

export function BulkConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  destructive = false,
  reasonRequired = false,
  reasonLabel = 'Reason',
  onSubmit,
}: BulkConfirmDialogProps) {
  const [reason, setReason] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const canSubmit = !submitting && (!reasonRequired || reason.trim().length > 0)

  async function submit() {
    setSubmitting(true)
    setError(null)
    try {
      await onSubmit(reason.trim())
      setReason('')
      onOpenChange(false)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog modal open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay key="overlay" bg={'rgba(0,0,0,0.6)' as never} />
        <Dialog.Content
          bg="$background"
          borderColor="$borderColor"
          borderWidth={1}
          minW={520}
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
              {reasonLabel}
              {reasonRequired ? ' *' : ''}
            </Text>
            <Input
              value={reason}
              onChangeText={setReason}
              placeholder={reasonRequired ? 'required' : 'optional'}
              size="$3"
            />
          </YStack>
          {error ? (
            <Alert variant="destructive" title="Could not start batch">
              {error}
            </Alert>
          ) : null}
          <XStack gap="$2" justify="flex-end" mt="$2">
            <Button chromeless onPress={() => onOpenChange(false)} disabled={submitting}>
              <Text fontSize="$2">Cancel</Text>
            </Button>
            <Button
              onPress={() => void submit()}
              disabled={!canSubmit}
              bg={
                destructive
                  ? ('rgba(252,165,165,0.12)' as never)
                  : ('#f2f2f2' as never)
              }
              borderWidth={destructive ? 1 : 0}
              borderColor={destructive ? ('#fca5a5' as never) : undefined}
              hoverStyle={
                destructive
                  ? { background: 'rgba(252,165,165,0.18)' as never }
                  : { background: '#ffffff' as never }
              }
            >
              <XStack items="center" gap="$1.5">
                {submitting ? <Spinner size="small" /> : null}
                <Text
                  fontSize="$2"
                  fontWeight="500"
                  color={destructive ? ('#fca5a5' as never) : ('#070b13' as never)}
                >
                  {submitting ? 'Submitting…' : confirmLabel}
                </Text>
              </XStack>
            </Button>
          </XStack>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  )
}
