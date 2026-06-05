import type { AuthUser } from '~/features/iam/server'
import type {
  getSubscriptions,
  getUserAccessInfo,
  getUserDetails,
  getUserThemeHistories,
} from '../user/helpers'

// Loose row alias so we don't keep importing supabase-generated types.
// TODO(supabase-rip): replace with concrete Base record types per collection.
type TeamRow = Record<string, unknown> & {
  id?: number
  name?: string
  is_personal?: boolean
  is_active?: boolean
  owner_id?: string
  tier?: string
}

export type UserContextType = {
  subscriptions?: Awaited<ReturnType<typeof getSubscriptions>> | null
  user: AuthUser
  userDetails?: Awaited<ReturnType<typeof getUserDetails>> | null
  teams: {
    all?: TeamRow[] | null
    orgs?: TeamRow[] | null
    personal?: TeamRow | null
    main?: TeamRow | null
  }
  accessInfo: Awaited<ReturnType<typeof getUserAccessInfo>>
  themeHistories?: Awaited<ReturnType<typeof getUserThemeHistories>>
  githubUsername?: string | null
}
