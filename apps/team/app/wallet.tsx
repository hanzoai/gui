import { useEffect, useState } from 'react'
import { Separator, SizableText, XStack, YStack } from '@hanzo/gui'
import { useSession } from '~/src/session'
import { Prompt } from '~/components/Prompt'
import { fetchWallet, type Wallet } from '~/src/billing'

// Real balance + usage from billing.hanzo.ai, read with the session's bearer token.
// No hardcoded money: signed-out shows a sign-in prompt; a failed fetch shows an
// honest unavailable state rather than a fake $0.00.
export default function WalletScreen() {
  const { session, loading } = useSession()
  const [wallet, setWallet] = useState<Wallet | null>(null)
  const [state, setState] = useState<'idle' | 'loading' | 'error'>('idle')

  useEffect(() => {
    const token = session?.accessToken
    if (token == null) return
    let live = true
    setState('loading')
    void fetchWallet(token)
      .then((w) => {
        if (live) {
          setWallet(w)
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
    return <Prompt title="Wallet" caption="Sign in to see your balance and AI usage." />

  const balance =
    wallet != null ? `$${wallet.balanceUsd.toFixed(2)}` : state === 'error' ? '—' : '…'

  return (
    <YStack p="$4" gap="$4" maxW={560} width="100%" self="center">
      <YStack
        bg="$color1"
        borderWidth={1}
        borderColor="$borderColor"
        rounded="$6"
        p="$4"
        gap="$1"
      >
        <SizableText size="$2" color="$color10">
          Balance
        </SizableText>
        <SizableText size="$9" fontWeight="600">
          {balance}
        </SizableText>
        <SizableText size="$1" color="$color10">
          {state === 'error'
            ? 'Balance unavailable right now'
            : 'Usage-metered · billed via billing.hanzo.ai'}
        </SizableText>
      </YStack>

      {wallet != null && wallet.usage.length > 0 ? (
        <YStack bg="$color1" borderWidth={1} borderColor="$borderColor" rounded="$6">
          {wallet.usage.map((row, index) => (
            <YStack key={row.label}>
              {index > 0 ? <Separator borderColor="$borderColor" /> : null}
              <XStack p="$3.5" items="center" justify="space-between">
                <SizableText size="$3" color="$color10">
                  {row.label}
                </SizableText>
                <SizableText size="$3" fontWeight="600">
                  {row.value}
                </SizableText>
              </XStack>
            </YStack>
          ))}
        </YStack>
      ) : null}
    </YStack>
  )
}
