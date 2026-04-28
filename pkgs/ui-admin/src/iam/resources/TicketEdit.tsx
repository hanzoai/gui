// Ticket editor — single ticket. Top section has the metadata + state
// dropdown; the bottom is a chat-style transcript with a Ctrl+Enter
// send shortcut. Admins can post; the ticket's owner can post if the
// state is not Closed. Server-side enforces both.

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Button,
  Input,
  Select,
  Text,
  TextArea,
  XStack,
  YStack,
} from 'hanzogui'
import { Send } from '@hanzogui/lucide-icons-2/icons/Send'
import { User } from '@hanzogui/lucide-icons-2/icons/User'
import { Badge } from '../../primitives/Badge'
import { useFetch } from '../../data/useFetch'
import { formatTimestamp } from '../../data/format'
import {
  TicketUrls,
  type ItemResponse,
  type TicketItem,
  type TicketMessage,
} from './api'
import {
  isAdminAccount,
  type AdminAccount,
  type TicketState,
} from './types'

const STATES: TicketState[] = ['Open', 'In Progress', 'Resolved', 'Closed']

export interface TicketEditProps {
  account: AdminAccount
}

export function TicketEdit({ account }: TicketEditProps) {
  const nav = useNavigate()
  const params = useParams<{ owner: string; ticketName: string }>()
  const owner = params.owner ?? ''
  const ticketName = params.ticketName ?? ''

  const url = useMemo(
    () => TicketUrls.one(owner, ticketName),
    [owner, ticketName],
  )
  const { data, isLoading, error, mutate } =
    useFetch<ItemResponse<TicketItem>>(url)

  const [ticket, setTicket] = useState<TicketItem | null>(null)
  const [messageText, setMessageText] = useState('')
  const [sending, setSending] = useState(false)
  const [saving, setSaving] = useState(false)
  const [statusMsg, setStatusMsg] = useState<string | null>(null)

  useEffect(() => {
    if (data?.data) {
      const t = data.data
      // Backend sometimes serializes empty list as null; normalize.
      if (t.messages === null) t.messages = []
      setTicket(t)
    }
  }, [data])

  const update = useCallback(
    <K extends keyof TicketItem>(key: K, value: TicketItem[K]) => {
      setTicket((prev) => (prev ? { ...prev, [key]: value } : prev))
    },
    [],
  )

  const submitEdit = useCallback(
    async (exit: boolean) => {
      if (!ticket) return
      setSaving(true)
      setStatusMsg(null)
      try {
        const res = await fetch(TicketUrls.update(owner, ticketName), {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(ticket),
        })
        if (!res.ok) throw new Error(`save failed: ${res.status}`)
        if (exit) nav('/tickets')
        else nav(`/tickets/${ticket.owner}/${ticket.name}`)
      } catch (e) {
        setStatusMsg(e instanceof Error ? e.message : 'save failed')
      } finally {
        setSaving(false)
      }
    },
    [nav, owner, ticket, ticketName],
  )

  const sendMessage = useCallback(async () => {
    if (!ticket || !messageText.trim()) {
      setStatusMsg('Please enter a message')
      return
    }
    setSending(true)
    setStatusMsg(null)
    try {
      const m: TicketMessage = {
        author: account.name,
        text: messageText,
        timestamp: new Date().toISOString(),
        isAdmin: isAdminAccount(account),
      }
      const res = await fetch(
        TicketUrls.appendMessage(owner, ticketName),
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(m),
        },
      )
      if (!res.ok) throw new Error(`send failed: ${res.status}`)
      setMessageText('')
      await mutate()
    } catch (e) {
      setStatusMsg(e instanceof Error ? e.message : 'send failed')
    } finally {
      setSending(false)
    }
  }, [account, messageText, mutate, owner, ticket, ticketName])

  if (isLoading || !ticket) {
    return (
      <YStack p="$4">
        <Text color="$placeholderColor">
          {error ? `Could not load: ${error.message}` : 'Loading ticket...'}
        </Text>
      </YStack>
    )
  }

  const isAdmin = isAdminAccount(account)
  const isOwner = account.name === ticket.user

  return (
    <YStack gap="$5">
      <YStack gap="$3" borderBottomWidth={1} borderBottomColor="$borderColor">
        <XStack
          items="center"
          justify="space-between"
          p="$4"
          borderBottomWidth={1}
          borderBottomColor="$borderColor"
        >
          <Text fontSize="$6" fontWeight="600" color="$color">
            Edit Ticket
          </Text>
          <XStack gap="$2">
            <Button disabled={saving} onPress={() => submitEdit(false)}>
              Save
            </Button>
            <Button
              theme="blue"
              disabled={saving}
              onPress={() => submitEdit(true)}
            >
              Save &amp; Exit
            </Button>
          </XStack>
        </XStack>

        {statusMsg ? (
          <Text fontSize="$2" color="#fca5a5" px="$4">
            {statusMsg}
          </Text>
        ) : null}

        <YStack p="$4" gap="$4">
          {(
            [
              { label: 'Organization', key: 'owner', disabled: true },
              { label: 'Name', key: 'name', disabled: !isAdmin },
              { label: 'Display name', key: 'displayName', disabled: false },
              { label: 'Created', key: 'createdTime', disabled: true },
              { label: 'Updated', key: 'updatedTime', disabled: true },
              {
                label: 'Title',
                key: 'title',
                disabled: !isAdmin && !isOwner,
              },
              { label: 'User', key: 'user', disabled: true },
            ] as ReadonlyArray<{
              label: string
              key: keyof TicketItem
              disabled: boolean
            }>
          ).map(({ label, key, disabled }) => (
            <Field key={key} label={label}>
              <Input
                value={(ticket[key] as string | undefined) ?? ''}
                disabled={disabled}
                onChangeText={(v) =>
                  update(key, v as TicketItem[typeof key])
                }
              />
            </Field>
          ))}
          <Field label="Content">
            <TextArea
              value={ticket.content}
              disabled={!isAdmin && !isOwner}
              onChangeText={(v) => update('content', v)}
            />
          </Field>
          <Field label="State">
            <Select
              value={ticket.state}
              onValueChange={(v: string) => update('state', v as TicketState)}
            >
              <Select.Trigger disabled={!isAdmin && ticket.state === 'Closed'}>
                <Select.Value placeholder="Select state" />
              </Select.Trigger>
              <Select.Content>
                {STATES.map((s, i) => (
                  <Select.Item key={s} value={s} index={i}>
                    <Select.ItemText>{s}</Select.ItemText>
                  </Select.Item>
                ))}
              </Select.Content>
            </Select>
          </Field>
        </YStack>
      </YStack>

      <YStack gap="$3">
        <Text fontSize="$5" fontWeight="600" color="$color" px="$4">
          Messages
        </Text>
        <YStack p="$4" gap="$3">
          {(ticket.messages ?? []).map((m, i) => (
            <XStack key={i} gap="$3" items="flex-start">
              <YStack
                width={32}
                height={32}
                rounded={'$10' as never}
                bg={
                  (m.isAdmin
                    ? 'rgba(59,130,246,0.6)'
                    : 'rgba(34,197,94,0.6)') as never
                }
                items="center"
                justify="center"
              >
                <User size={16} />
              </YStack>
              <YStack flex={1} gap="$1">
                <XStack gap="$2" items="center">
                  <Text fontSize="$2" fontWeight="600" color="$color">
                    {m.author}
                  </Text>
                  {m.isAdmin ? <Badge variant="info">Admin</Badge> : null}
                  <Text fontSize="$1" color="$placeholderColor">
                    {formatTimestamp(new Date(m.timestamp))}
                  </Text>
                </XStack>
                <Text fontSize="$2" color="$color">
                  {m.text}
                </Text>
              </YStack>
            </XStack>
          ))}
          <XStack gap="$3" items="flex-start">
            <TextArea
              flex={1}
              value={messageText}
              placeholder="Type your message..."
              onChangeText={setMessageText}
              // The Hanzogui TextArea forwards onKeyDown to the
              // underlying div on web; the typed signature uses
              // HTMLDivElement. We read the same `key`/`ctrlKey`
              // fields from either shape, so the cast is safe.
              onKeyDown={((e: React.KeyboardEvent<HTMLDivElement>) => {
                if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                  void sendMessage()
                }
              }) as React.KeyboardEventHandler<HTMLDivElement>}
            />
            <Button disabled={sending} icon={Send} onPress={sendMessage}>
              Send
            </Button>
          </XStack>
          <Text fontSize="$1" color="$placeholderColor">
            Press Ctrl+Enter to send.
          </Text>
        </YStack>
      </YStack>
    </YStack>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <XStack gap="$3" items="center">
      <YStack width={160}>
        <Text fontSize="$2" color="$placeholderColor">
          {label}
        </Text>
      </YStack>
      <YStack flex={1}>{children}</YStack>
    </XStack>
  )
}
