// EntryPage — the post-login landing decision. Two callers actually
// matter: an authenticated browser (route to admin) and an
// unauthenticated browser (route to /login). Everything else is a
// noisy redirect chain we don't need to reproduce.
//
// Original at `~/work/hanzo/iam/web/src/EntryPage.tsx`. That version
// is also the route table for every public auth flow page; in the
// admin port we keep this *just* the decision, and let the calling
// router compose the actual <Login> / <Signup> / <ForgetPage> screens
// from the `auth/` barrel.

import { useEffect } from 'react'
import { Paragraph, YStack } from 'hanzogui'

export type EntryAccount =
  // Account is loaded and the user is signed in.
  | { kind: 'authenticated'; userId: string; orgSlug: string }
  // Account check completed and there's no session.
  | { kind: 'anonymous' }
  // Account check is still in flight.
  | { kind: 'loading' }

export interface EntryPageProps {
  account: EntryAccount
  // Route to send authenticated users to. Defaults to "/".
  authenticatedTo?: string
  // Route to send anonymous users to. Defaults to "/login".
  loginTo?: string
  // The router-aware navigate function. Caller wires this from
  // react-router's `useNavigate()` so we don't import the router
  // here (this package keeps router-dom as a peer dep, which means
  // it's fine to use, but EntryPage is genuinely route-shape
  // agnostic so we just take a callback).
  navigate: (to: string) => void
}

export function EntryPage({
  account,
  authenticatedTo = '/',
  loginTo = '/login',
  navigate,
}: EntryPageProps) {
  useEffect(() => {
    if (account.kind === 'authenticated') {
      navigate(authenticatedTo)
    } else if (account.kind === 'anonymous') {
      navigate(loginTo)
    }
  }, [account, authenticatedTo, loginTo, navigate])

  if (account.kind === 'loading') {
    return (
      <YStack flex={1} items="center" justify="center" p="$6">
        <Paragraph color="$placeholderColor">Loading…</Paragraph>
      </YStack>
    )
  }

  return null
}
