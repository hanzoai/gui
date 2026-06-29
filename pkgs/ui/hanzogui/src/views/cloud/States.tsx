/**
 * Honest async states — one truthful way to explain a failed/empty load.
 *
 * A `/v1`-style endpoint can 404 (not routed on this deployment), 401/403
 * (access enforced server-side), or 503 (backend starting). `honestError` maps a
 * structural error (`{ status?, message }`) to a specific, truthful title+body —
 * never a generic crash, never fabricated data — and `ErrorState` renders it with
 * an optional retry. Decoupled from any HTTP client: pass any error with a
 * numeric `status` and a `message`.
 */
import { Button } from '@hanzogui/button'
import { Card } from '@hanzogui/card'
import { XStack } from '@hanzogui/stacks'
import { TriangleAlert } from '@hanzogui/lucide-icons-2'
import { Text } from '../Text'

/** Surface-specific overrides for the 404/unauthorized explanations. */
export type HonestCopy = { notFound?: string; unauthorized?: string }

/** A structural error: an HTTP-ish status plus a message. No client coupling. */
export type HonestErrorLike = { status?: number; message: string }

/** Map a structural error to an honest title + body. Defaults are truthful. */
export function honestError(
  err: HonestErrorLike,
  copy: HonestCopy = {},
): { title: string; body: string } {
  if (err.status === 404)
    return {
      title: 'Not available on this deployment',
      body:
        copy.notFound ??
        'This API is not routed on this host yet. It appears automatically once the deployment proxies it through the gateway.',
    }
  if (err.status === 503)
    return {
      title: 'Service unavailable',
      body: 'The service is starting up or temporarily unavailable. Retry in a moment.',
    }
  if (err.status === 401 || err.status === 403 || /sign ?in|login|unauthorized/i.test(err.message))
    return {
      title: 'Access required',
      body:
        copy.unauthorized ??
        'This view requires an authorized session, enforced server-side. Sign in with an account that has access.',
    }
  return { title: 'Could not load', body: err.message }
}

/** The honest error card — title, explanation, and an optional retry. */
export function ErrorState({
  err,
  onRetry,
  copy,
}: {
  err: HonestErrorLike
  onRetry?: () => void
  copy?: HonestCopy
}) {
  const { title, body } = honestError(err, copy)
  return (
    <Card borderWidth={1} borderColor="$borderColor" p="$4" gap="$2" maxWidth={620}>
      <XStack gap="$2" items="center">
        <TriangleAlert size={16} />
        <Text fontSize="$4" fontWeight="700">
          {title}
        </Text>
      </XStack>
      <Text fontSize="$3" color="$color11">
        {body}
      </Text>
      {onRetry ? (
        <Button size="$2" self="flex-start" onPress={onRetry}>
          Retry
        </Button>
      ) : null}
    </Card>
  )
}
