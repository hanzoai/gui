import { useCallback, useEffect, useState } from 'react'
import { useLocalSearchParams } from 'one'
import { Button, Input, ScrollView, SizableText, XStack, YStack } from '@hanzo/gui'
import { useSession } from '~/src/session'
import { Prompt } from '~/components/Prompt'
import { team, type TeamMessage } from '~/src/api'

// How often an open room re-reads its tail. Messages have no push channel of
// their own, so the room asks; often enough to feel like a conversation, rarely
// enough that an idle tab costs nothing worth counting.
const REFRESH_MS = 5000

// The surface stamps unix milliseconds; the reader wants a clock. A message with
// no stamp gets no time rather than a fabricated one at the epoch.
function clock(createdOn: number | undefined): string {
  if (createdOn == null) return ''
  return new Date(createdOn).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })
}

// An author is an account uuid, not a display name — the roster owns names, and
// copying one onto every message is how the two come to disagree. Until a room
// reads the roster, show enough of the account to tell two people apart.
function who(author: string | undefined): string {
  return author?.slice(0, 8) ?? 'unknown'
}

export default function RoomScreen() {
  const { session, loading } = useSession()
  const params = useLocalSearchParams<{ id?: string; space?: string }>()
  const room = params.id ?? ''
  const space = params.space ?? ''
  const [messages, setMessages] = useState<TeamMessage[]>([])
  const [state, setState] = useState<'idle' | 'loading' | 'error'>('idle')
  const [draft, setDraft] = useState('')
  const [sending, setSending] = useState(false)

  const token = session?.accessToken

  const refresh = useCallback(async () => {
    if (token == null || room === '' || space === '') return
    try {
      setMessages(await team(token).messages(room, space))
      setState('idle')
    } catch {
      setState('error')
    }
  }, [room, space, token])

  useEffect(() => {
    if (token == null) return
    setState('loading')
    void refresh()
    const timer = setInterval(() => void refresh(), REFRESH_MS)
    return () => clearInterval(timer)
  }, [refresh, token])

  const say = useCallback(async () => {
    const text = draft.trim()
    if (text === '' || token == null || sending) return
    setSending(true)
    try {
      const said = await team(token).say(room, space, text)
      setMessages((prior) => [...prior, said])
      setDraft('')
    } catch {
      setState('error')
    } finally {
      setSending(false)
    }
  }, [draft, room, sending, space, token])

  if (!loading && session == null)
    return <Prompt title="Room" caption="Sign in to read this room." />

  return (
    <YStack flex={1} maxW={720} width="100%" self="center">
      <ScrollView flex={1} contentContainerStyle={{ p: '$4', gap: '$3' }}>
        {messages.map((message) => (
          <YStack key={message.id ?? `${message.createdOn}-${message.author}`} gap="$1">
            <XStack gap="$2" items="baseline">
              <SizableText size="$2" fontWeight="600">
                {who(message.author)}
              </SizableText>
              <SizableText size="$1" color="$color10">
                {clock(message.createdOn)}
              </SizableText>
            </XStack>
            <SizableText size="$3">{message.text ?? ''}</SizableText>
          </YStack>
        ))}
        {messages.length === 0 ? (
          <SizableText size="$3" color="$color10">
            {state === 'error'
              ? 'This room is unavailable right now.'
              : state === 'loading'
                ? 'Loading…'
                : 'Nothing said yet.'}
          </SizableText>
        ) : null}
      </ScrollView>

      <XStack
        p="$3"
        gap="$2"
        borderTopWidth={1}
        borderColor="$borderColor"
        items="center"
      >
        <Input
          flex={1}
          value={draft}
          onChangeText={setDraft}
          onSubmitEditing={() => void say()}
          placeholder="Message"
          returnKeyType="send"
        />
        <Button disabled={sending || draft.trim() === ''} onPress={() => void say()}>
          Send
        </Button>
      </XStack>
    </YStack>
  )
}
