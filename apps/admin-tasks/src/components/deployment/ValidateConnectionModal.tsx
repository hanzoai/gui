// ValidateConnectionModal — fires a smoke-test against a deployment
// version's worker registration. Renders the in-flight spinner and a
// per-check chip grid (network / registered / heartbeat / latency)
// once the call returns.

import { useEffect } from 'react'
import { Button, Card, H3, Spinner, Text, XStack, YStack } from 'hanzogui'

export interface ValidateResult {
  valid: boolean
  message?: string
  network?: boolean
  workerRegistered?: boolean
  heartbeatReceived?: boolean
  latencyMs?: number
}

export interface ValidateConnectionModalProps {
  deploymentName: string
  buildId: string
  open: boolean
  loading: boolean
  result: ValidateResult | null
  error?: string
  onClose: () => void
}

const MONO = 'ui-monospace, SFMono-Regular, monospace'

export function ValidateConnectionModal({
  deploymentName,
  buildId,
  open,
  loading,
  result,
  error,
  onClose,
}: ValidateConnectionModalProps) {
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
      bg={'rgba(0,0,0,0.55)' as never}
      items="center"
      justify="center"
      z={1000}
      style={{ position: 'fixed' as never }}
      onPress={onClose}
    >
      <Card
        width={520}
        maxWidth={'90vw' as never}
        p="$5"
        gap="$4"
        bg="$background"
        borderColor="$borderColor"
        borderWidth={1}
        onPress={(e: { stopPropagation: () => void }) => e.stopPropagation()}
      >
        <YStack gap="$1">
          <H3 size="$5" color="$color" fontWeight="500">
            Validate connection
          </H3>
          <Text fontSize="$1" color="$placeholderColor">
            {deploymentName} ·{' '}
            <Text fontFamily={MONO as never} fontSize="$1" color="$placeholderColor">
              {buildId}
            </Text>
          </Text>
        </YStack>

        {loading ? (
          <XStack gap="$2" items="center" py="$2">
            <Spinner size="small" />
            <Text fontSize="$2" color="$placeholderColor">
              Probing worker…
            </Text>
          </XStack>
        ) : error ? (
          <Card
            bg={'rgba(252,165,165,0.08)' as never}
            borderColor={'#fca5a5' as never}
            borderWidth={1}
            p="$3"
          >
            <Text fontSize="$2" color={'#fca5a5' as never}>
              {error}
            </Text>
          </Card>
        ) : result ? (
          <YStack gap="$2">
            <XStack
              p="$3"
              borderColor="$borderColor"
              borderWidth={1}
              rounded="$2"
              bg={
                result.valid
                  ? ('rgba(134,239,172,0.08)' as never)
                  : ('rgba(252,165,165,0.08)' as never)
              }
              items="center"
              gap="$2"
            >
              <Text
                fontSize="$2"
                fontWeight="500"
                color={
                  result.valid
                    ? ('#86efac' as never)
                    : ('#fca5a5' as never)
                }
              >
                {result.valid ? '✓ Valid connection' : '✗ Connection failed'}
              </Text>
              {result.message ? (
                <Text fontSize="$1" color="$placeholderColor">
                  {result.message}
                </Text>
              ) : null}
            </XStack>
            <XStack gap="$2" flexWrap="wrap">
              <Chip
                label="Network"
                state={chipState(result.network)}
              />
              <Chip
                label="Worker registered"
                state={chipState(result.workerRegistered)}
              />
              <Chip
                label="Heartbeat"
                state={chipState(result.heartbeatReceived)}
              />
              {result.latencyMs !== undefined ? (
                <Chip label="Latency" state="info" detail={`${result.latencyMs}ms`} />
              ) : null}
            </XStack>
          </YStack>
        ) : null}

        <XStack gap="$2" justify="flex-end">
          <Button size="$2" onPress={onClose} disabled={loading}>
            <Text fontSize="$2">Close</Text>
          </Button>
        </XStack>
      </Card>
    </YStack>
  )
}

type ChipState = 'ok' | 'fail' | 'unknown' | 'info'

function chipState(b: boolean | undefined): ChipState {
  if (b === true) return 'ok'
  if (b === false) return 'fail'
  return 'unknown'
}

function Chip({
  label,
  state,
  detail,
}: {
  label: string
  state: ChipState
  detail?: string
}) {
  const color =
    state === 'ok'
      ? '#86efac'
      : state === 'fail'
        ? '#fca5a5'
        : state === 'info'
          ? '#fde68a'
          : '#7e8794'
  const symbol = state === 'ok' ? '✓' : state === 'fail' ? '✗' : state === 'info' ? '·' : '?'
  return (
    <XStack
      gap="$1"
      px="$2"
      py="$1"
      borderWidth={1}
      borderColor="$borderColor"
      rounded="$2"
      items="center"
    >
      <Text fontSize="$1" color={color as never} fontWeight="700">
        {symbol}
      </Text>
      <Text fontSize="$1" color="$color">
        {label}
      </Text>
      {detail ? (
        <Text fontSize="$1" color="$placeholderColor">
          {detail}
        </Text>
      ) : null}
    </XStack>
  )
}
