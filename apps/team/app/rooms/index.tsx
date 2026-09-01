import { useEffect, useState } from 'react'
import { Link } from 'one'
import { Separator, SizableText, XStack, YStack } from '@hanzo/gui'
import { useSession } from '~/src/session'
import { Prompt } from '~/components/Prompt'
import { fetchRooms, type Room } from '~/src/team'

// Every room the signed-in principal can see. Archived rooms are left out — they
// are still readable by id, but a list of them is a filing cabinet, not a place
// to talk. A room link carries its space because a room id alone is ambiguous.
export default function RoomsScreen() {
  const { session, loading } = useSession()
  const [rooms, setRooms] = useState<Room[] | null>(null)
  const [state, setState] = useState<'idle' | 'loading' | 'error'>('idle')

  useEffect(() => {
    const token = session?.accessToken
    if (token == null) return
    let live = true
    setState('loading')
    void fetchRooms(token)
      .then((list) => {
        if (live) {
          setRooms(list)
          setState('idle')
        }
      })
      .catch(() => {
        if (live) setState('error')
      })
    return () => {
      live = false
    }
  }, [session?.accessToken])

  if (!loading && session == null)
    return <Prompt title="Rooms" caption="Sign in to read and join your org's rooms." />

  const open = (rooms ?? []).filter((room) => !room.archived)

  return (
    <YStack p="$4" gap="$4" maxW={560} width="100%" self="center">
      <SizableText size="$7" fontWeight="600">
        Rooms
      </SizableText>

      {open.length > 0 ? (
        <YStack bg="$color1" borderWidth={1} borderColor="$borderColor" rounded="$6">
          {open.map((room, index) => (
            <YStack key={`${room.space}/${room.id}`}>
              {index > 0 ? <Separator borderColor="$borderColor" /> : null}
              <Link
                href={`/rooms/${room.id}?space=${encodeURIComponent(room.space)}`}
                asChild
              >
                <XStack p="$3.5" items="center" justify="space-between" cursor="pointer">
                  <YStack gap="$1" flex={1}>
                    <SizableText size="$4" fontWeight="600">
                      {room.name}
                    </SizableText>
                    {room.topic != null && room.topic !== '' ? (
                      <SizableText size="$2" color="$color10">
                        {room.topic}
                      </SizableText>
                    ) : null}
                  </YStack>
                  {room.private ? (
                    <SizableText size="$1" color="$color10">
                      Private
                    </SizableText>
                  ) : null}
                </XStack>
              </Link>
            </YStack>
          ))}
        </YStack>
      ) : (
        <SizableText size="$3" color="$color10">
          {state === 'error'
            ? 'Rooms are unavailable right now.'
            : state === 'loading'
              ? 'Loading…'
              : 'No rooms yet.'}
        </SizableText>
      )}
    </YStack>
  )
}
