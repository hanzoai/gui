// TopBar — right chrome for an admin app. Hosts:
//   - left:  optional namespace/tenant switcher
//   - right: optional clock toggle, theme toggle, account chip
//
// The TopBar itself is a thin layout shell; each piece is a separate
// component the caller can pick from. We do not assume namespaces
// exist — kms, commerce, console all swap that slot for whatever
// scoping makes sense for them.

import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Input, Popover, Text, XStack, YStack } from 'hanzogui'
import { ChevronDown } from '@hanzogui/lucide-icons-2/icons/ChevronDown'
import { Clock } from '@hanzogui/lucide-icons-2/icons/Clock'
import { ExternalLink } from '@hanzogui/lucide-icons-2/icons/ExternalLink'
import { LogOut } from '@hanzogui/lucide-icons-2/icons/LogOut'
import { Moon } from '@hanzogui/lucide-icons-2/icons/Moon'
import { Search } from '@hanzogui/lucide-icons-2/icons/Search'
import { Sun } from '@hanzogui/lucide-icons-2/icons/Sun'
import { User } from '@hanzogui/lucide-icons-2/icons/User'
import { getTz, setTz, type Tz } from '../data/tz'

// `TopBar` accepts either an explicit `right` slot, or a `themeStorageKey`
// to use the default chrome (clock + theme + account). The discriminated
// union prevents callers from rendering the default chrome without a
// theme storage key — that key must be unique per admin surface so two
// apps sharing a host don't clobber each other's localStorage entry.
export type TopBarProps = {
  // Left slot — namespace / tenant / org switcher. Pass <NamespaceSwitcher /> or your own.
  left?: ReactNode
} & (
  | {
      // Right slot — fully caller-provided chrome. The caller owns key isolation.
      right: ReactNode
      themeStorageKey?: never
    }
  | {
      right?: undefined
      // Required when no `right` is provided. Forwards to the default chrome's
      // <ThemeToggle storageKey={…} />. Must be unique per admin app
      // (e.g. `tasks.theme`, `kms.theme`).
      themeStorageKey: string
    }
)

export function TopBar(props: TopBarProps) {
  // The discriminated union guarantees: either `right` is provided, or
  // `themeStorageKey` is — never neither. We resolve which branch we're
  // in once, up front, so the JSX below stays flat. We narrow via
  // `'themeStorageKey' in props` because the union's discriminant is
  // the *presence* of that key, not the value of `right` (TS can't
  // transitively infer one variant from `right !== undefined`).
  const rightSlot: ReactNode =
    'themeStorageKey' in props && props.themeStorageKey !== undefined ? (
      <>
        <LocalTimeIndicator />
        <ThemeToggle storageKey={props.themeStorageKey} />
        <AccountChip />
      </>
    ) : (
      props.right
    )
  return (
    <XStack
      height={56}
      px="$5"
      gap="$3"
      borderBottomWidth={1}
      borderBottomColor="$borderColor"
      bg={'rgba(7,11,19,0.6)' as never}
      items="center"
    >
      {props.left}
      <XStack ml="auto" gap="$2" items="center">
        {rightSlot}
      </XStack>
    </XStack>
  )
}

// ── Namespace switcher — generic over any { id, label } list ──────────

export interface NamespaceOption {
  id: string
  label: string
  // Optional role on this namespace ("admin", "writer", "reader"). When
  // present, the chip is rendered to the right of the label so users
  // see at a glance what they can do without opening the namespace.
  role?: string
}

export interface NamespaceSwitcherProps {
  active?: string
  options: NamespaceOption[]
  // Path builder for a chosen namespace — e.g. (id) => `/namespaces/${id}/workflows`.
  hrefFor: (id: string) => string
  // "All namespaces…" link. If omitted, the row is hidden.
  allHref?: string
  // Docs link icon. If omitted, the icon is hidden.
  docsHref?: string
  // Default placeholder shown when no `active`.
  placeholder?: string
  // Header text for the popover ("Switch namespace" / "Switch organization").
  groupLabel?: string
  // Recently-visited namespace ids in MRU order. The first N (capped
  // to 5) get pinned above the alphabetical list. Undefined / empty
  // hides the recents section. Caller owns persistence.
  recents?: string[]
  // Search threshold — show the search input when option count exceeds
  // this. Defaults to 6 (matches upstream temporal/ui combobox).
  searchThreshold?: number
}

const RECENTS_CAP = 5

export function NamespaceSwitcher({
  active,
  options,
  hrefFor,
  allHref,
  docsHref,
  placeholder = 'default',
  groupLabel = 'Switch namespace',
  recents,
  searchThreshold = 6,
}: NamespaceSwitcherProps) {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  // Reset the filter every time the popover closes; otherwise users
  // re-open it to a stale query that hides options they expect to see.
  useEffect(() => {
    if (!open) setQuery('')
  }, [open])

  const showSearch = options.length > searchThreshold

  // Filter, then partition into recents / others. We keep the
  // alphabetical caller order for "others" (the caller is expected to
  // sort once); recents are projected from the `recents` array so MRU
  // ordering is preserved.
  const [recentOpts, otherOpts] = useMemo(() => {
    const q = query.trim().toLowerCase()
    const filtered = q
      ? options.filter((o) => o.label.toLowerCase().includes(q))
      : options
    if (!recents?.length) return [[], filtered] as const
    const recentSet = new Set(recents.slice(0, RECENTS_CAP))
    const inRecent = recents
      .slice(0, RECENTS_CAP)
      .map((id) => filtered.find((o) => o.id === id))
      .filter((o): o is NamespaceOption => Boolean(o))
    const rest = filtered.filter((o) => !recentSet.has(o.id))
    return [inRecent, rest] as const
  }, [options, recents, query])

  return (
    <XStack items="center" gap="$1.5">
      <Popover open={open} onOpenChange={setOpen} placement="bottom-start">
        <Popover.Trigger asChild>
          <Button
            size="$2"
            chromeless
            borderWidth={1}
            borderColor="$borderColor"
            bg={'rgba(255,255,255,0.02)' as never}
          >
            <XStack items="center" gap="$1.5">
              <Text fontSize="$2" fontWeight="500" color="$color">
                {active ?? placeholder}
              </Text>
              <ChevronDown size={14} color="#7e8794" />
            </XStack>
          </Button>
        </Popover.Trigger>
        <Popover.Content
          bg="$background"
          borderWidth={1}
          borderColor="$borderColor"
          p="$2"
          minW={260}
          maxH={420}
          elevate
        >
          <YStack gap="$1">
            <Text px="$2" py="$1" fontSize="$1" color="$placeholderColor" fontWeight="500">
              {groupLabel}
            </Text>
            <YStack borderBottomWidth={1} borderBottomColor="$borderColor" my="$1" />
            {showSearch ? (
              <XStack
                items="center"
                gap="$1.5"
                px="$2"
                py="$1"
                rounded="$2"
                bg={'rgba(255,255,255,0.04)' as never}
              >
                <Search size={12} color="#7e8794" />
                <Input
                  unstyled
                  flex={1}
                  size="$2"
                  fontSize="$2"
                  color="$color"
                  placeholder="Filter namespaces…"
                  placeholderTextColor="$placeholderColor"
                  value={query}
                  onChangeText={setQuery}
                  data-testid="namespace-search"
                  aria-label="Filter namespaces"
                />
              </XStack>
            ) : null}
            {options.length === 0 ? (
              <Text px="$2" py="$1.5" fontSize="$2" color="$placeholderColor" opacity={0.6}>
                None available
              </Text>
            ) : recentOpts.length === 0 && otherOpts.length === 0 ? (
              <Text px="$2" py="$1.5" fontSize="$2" color="$placeholderColor" opacity={0.6}>
                No matches
              </Text>
            ) : (
              <YStack gap="$1" maxH={300} overflow="hidden">
                {recentOpts.length > 0 ? (
                  <>
                    <Text px="$2" pt="$1" fontSize={10} color="$placeholderColor" letterSpacing={0.6}>
                      RECENT
                    </Text>
                    {recentOpts.map((opt) => (
                      <NamespaceRow
                        key={`r-${opt.id}`}
                        opt={opt}
                        active={opt.id === active}
                        onPress={() => {
                          setOpen(false)
                          navigate(hrefFor(opt.id))
                        }}
                      />
                    ))}
                    {otherOpts.length > 0 ? (
                      <>
                        <YStack borderBottomWidth={1} borderBottomColor="$borderColor" my="$1" />
                        <Text px="$2" pt="$1" fontSize={10} color="$placeholderColor" letterSpacing={0.6}>
                          ALL
                        </Text>
                      </>
                    ) : null}
                  </>
                ) : null}
                {otherOpts.map((opt) => (
                  <NamespaceRow
                    key={opt.id}
                    opt={opt}
                    active={opt.id === active}
                    onPress={() => {
                      setOpen(false)
                      navigate(hrefFor(opt.id))
                    }}
                  />
                ))}
              </YStack>
            )}
            {allHref ? (
              <>
                <YStack borderBottomWidth={1} borderBottomColor="$borderColor" my="$1" />
                <PopoverRow
                  onPress={() => {
                    setOpen(false)
                    navigate(allHref)
                  }}
                >
                  <Text fontSize="$2" color="$color">
                    All namespaces…
                  </Text>
                </PopoverRow>
              </>
            ) : null}
          </YStack>
        </Popover.Content>
      </Popover>
      {docsHref ? (
        <a
          href={docsHref}
          target="_blank"
          rel="noopener noreferrer"
          title="Learn more"
          style={{ display: 'inline-flex', padding: 4, color: '#7e8794' }}
        >
          <ExternalLink size={14} />
        </a>
      ) : null}
    </XStack>
  )
}

function NamespaceRow({
  opt,
  active,
  onPress,
}: {
  opt: NamespaceOption
  active: boolean
  onPress: () => void
}) {
  return (
    <PopoverRow onPress={onPress}>
      <XStack items="center" gap="$2" flex={1}>
        <Text fontSize="$2" fontWeight={active ? '600' : '400'} color="$color" flex={1}>
          {opt.label}
        </Text>
        {opt.role ? (
          <XStack
            px="$1.5"
            py={2}
            rounded="$2"
            bg={'rgba(255,255,255,0.06)' as never}
            data-testid={`namespace-role-${opt.id}`}
          >
            <Text fontSize={9} color="$placeholderColor" letterSpacing={0.4}>
              {opt.role.toUpperCase()}
            </Text>
          </XStack>
        ) : null}
      </XStack>
    </PopoverRow>
  )
}

// ── Local time indicator — UTC / local toggle ─────────────────────────

export function LocalTimeIndicator() {
  const [tz, setTzState] = useState<Tz>(getTz())
  const [now, setNow] = useState(() => new Date())
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    setTz(tz)
  }, [tz])

  const label =
    tz === 'utc'
      ? `UTC ${String(now.getUTCHours()).padStart(2, '0')}:${String(now.getUTCMinutes()).padStart(2, '0')}`
      : 'local'

  return (
    <Popover open={open} onOpenChange={setOpen} placement="bottom-end">
      <Popover.Trigger asChild>
        <Button
          size="$2"
          chromeless
          borderWidth={1}
          borderColor="$borderColor"
          bg={'rgba(255,255,255,0.02)' as never}
        >
          <XStack items="center" gap="$1.5">
            <Clock size={12} color="#7e8794" />
            <Text fontSize="$1" color="$placeholderColor">
              {label}
            </Text>
          </XStack>
        </Button>
      </Popover.Trigger>
      <Popover.Content
        bg="$background"
        borderWidth={1}
        borderColor="$borderColor"
        p="$2"
        minW={140}
        elevate
      >
        <YStack gap="$1">
          <Text px="$2" py="$1" fontSize="$1" color="$placeholderColor" fontWeight="500">
            Time zone
          </Text>
          <YStack borderBottomWidth={1} borderBottomColor="$borderColor" my="$1" />
          <PopoverRow
            onPress={() => {
              setTzState('local')
              setOpen(false)
            }}
          >
            <Text fontSize="$2" fontWeight={tz === 'local' ? '600' : '400'} color="$color">
              Local
            </Text>
          </PopoverRow>
          <PopoverRow
            onPress={() => {
              setTzState('utc')
              setOpen(false)
            }}
          >
            <Text fontSize="$2" fontWeight={tz === 'utc' ? '600' : '400'} color="$color">
              UTC
            </Text>
          </PopoverRow>
        </YStack>
      </Popover.Content>
    </Popover>
  )
}

// ── Theme toggle — persists choice in localStorage ─────────────────────

export interface ThemeToggleProps {
  // localStorage key for persistence. Required: every admin app must
  // pick a distinct key (e.g. `tasks.theme`, `kms.theme`) so that two
  // surfaces sharing a host don't clobber each other's preference.
  storageKey: string
}

export function ThemeToggle({ storageKey }: ThemeToggleProps) {
  // Default to 'dark' on first paint (covers SSR + pre-hydration). The
  // effect below re-syncs from localStorage after mount; the brief flash
  // is acceptable for an admin surface and avoids hydration mismatch
  // warnings from rendering different markup on the server vs client.
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  useEffect(() => {
    if (typeof window === 'undefined') return
    const stored = localStorage.getItem(storageKey)
    if (stored === 'light' || stored === 'dark') setTheme(stored)
  }, [storageKey])
  useEffect(() => {
    if (typeof document === 'undefined') return
    document.documentElement.classList.toggle('dark', theme === 'dark')
    document.documentElement.classList.toggle('light', theme === 'light')
    if (typeof window !== 'undefined') localStorage.setItem(storageKey, theme)
  }, [theme, storageKey])
  return (
    <Button
      size="$2"
      chromeless
      onPress={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? <Sun size={16} color="#7e8794" /> : <Moon size={16} color="#7e8794" />}
    </Button>
  )
}

// ── Account chip ───────────────────────────────────────────────────────

export interface AccountChipProps {
  // Two-letter initials shown in the round chip (e.g. "HZ").
  initials?: string
  // Display name in the popover header.
  name?: string
  // Sub-line below the name ("local · embedded", "z@hanzo.ai").
  subtitle?: string
  // Identity link target. If not provided, the row is hidden.
  identityHref?: string
  // Sign-out callback. If not provided, the row is hidden.
  onSignOut?: () => void
}

export function AccountChip({
  initials = 'HZ',
  name = 'Hanzo',
  subtitle = 'local · embedded',
  identityHref,
  onSignOut,
}: AccountChipProps = {}) {
  const [open, setOpen] = useState(false)
  return (
    <Popover open={open} onOpenChange={setOpen} placement="bottom-end">
      <Popover.Trigger asChild>
        <Button
          width={32}
          height={32}
          rounded={9999}
          borderWidth={1}
          borderColor="$borderColor"
          bg={'#f2f2f2' as never}
          aria-label="Account"
        >
          <Text fontSize="$1" fontWeight="600" color={'#070b13' as never}>
            {initials}
          </Text>
        </Button>
      </Popover.Trigger>
      <Popover.Content
        bg="$background"
        borderWidth={1}
        borderColor="$borderColor"
        p="$2"
        minW={200}
        elevate
      >
        <YStack gap="$1">
          <YStack px="$2" py="$1.5">
            <Text fontSize="$2" fontWeight="500" color="$color">
              {name}
            </Text>
            {subtitle ? (
              <Text fontSize="$1" color="$placeholderColor">
                {subtitle}
              </Text>
            ) : null}
          </YStack>
          {(identityHref || onSignOut) ? (
            <YStack borderBottomWidth={1} borderBottomColor="$borderColor" my="$1" />
          ) : null}
          {identityHref ? (
            <PopoverRow
              onPress={() => {
                setOpen(false)
                // noopener,noreferrer drops the live `opener` reference so the
                // opened tab can't navigate us back (reverse-tabnabbing). The
                // void-assignment also discards any returned Window handle.
                const _ = window.open(identityHref, '_blank', 'noopener,noreferrer')
                void _
              }}
            >
              <XStack items="center" gap="$2">
                <User size={14} color="#7e8794" />
                <Text fontSize="$2" color="$color">
                  Identity
                </Text>
              </XStack>
            </PopoverRow>
          ) : null}
          {onSignOut ? (
            <PopoverRow
              onPress={() => {
                setOpen(false)
                onSignOut()
              }}
            >
              <XStack items="center" gap="$2">
                <LogOut size={14} color="#7e8794" />
                <Text fontSize="$2" color="$color">
                  Sign out
                </Text>
              </XStack>
            </PopoverRow>
          ) : null}
        </YStack>
      </Popover.Content>
    </Popover>
  )
}

function PopoverRow({
  onPress,
  children,
}: {
  onPress: () => void
  children: ReactNode
}) {
  return (
    <XStack
      px="$2"
      py="$1.5"
      rounded="$2"
      hoverStyle={{ background: 'rgba(255,255,255,0.04)' as never }}
      cursor="pointer"
      onPress={onPress}
    >
      {children}
    </XStack>
  )
}

// ── Env indicator — coloured chip ("prod", "staging", "local") ────────

export type EnvKind = 'prod' | 'staging' | 'dev' | 'local'

export interface EnvIndicatorProps {
  // Display name: "production", "Staging", "Local", etc. The kind
  // controls the colour; the label is what the user sees.
  label: string
  kind?: EnvKind
}

const ENV_PALETTE: Record<EnvKind, { bg: string; text: string; border: string }> = {
  prod: { bg: 'rgba(239,68,68,0.14)', text: '#fca5a5', border: 'rgba(239,68,68,0.4)' },
  staging: { bg: 'rgba(234,179,8,0.14)', text: '#fde68a', border: 'rgba(234,179,8,0.4)' },
  dev: { bg: 'rgba(59,130,246,0.14)', text: '#93c5fd', border: 'rgba(59,130,246,0.4)' },
  local: { bg: 'rgba(255,255,255,0.04)', text: '#7e8794', border: 'rgba(255,255,255,0.12)' },
}

export function EnvIndicator({ label, kind = 'local' }: EnvIndicatorProps) {
  const p = ENV_PALETTE[kind]
  return (
    <XStack
      px="$2"
      py={3}
      rounded="$2"
      borderWidth={1}
      borderColor={p.border as never}
      bg={p.bg as never}
      items="center"
      data-testid={`env-indicator-${kind}`}
    >
      <Text fontSize={10} color={p.text as never} letterSpacing={0.6} fontWeight="600">
        {label.toUpperCase()}
      </Text>
    </XStack>
  )
}

// ── Version badge — read-only build/version chip ──────────────────────

export interface VersionBadgeProps {
  // Full version string ("v2.45.3"). Rendered as a small monospace chip.
  version: string
  // Optional title attribute (commit SHA, build date) shown on hover.
  title?: string
}

export function VersionBadge({ version, title }: VersionBadgeProps) {
  // Hanzo GUI's `XStack` does not project a native `title` attribute (it
  // forwards a tightly typed prop set), so we fall back to `aria-label`
  // which is exposed to assistive tech *and* shown by some browsers as
  // a tooltip on focus. The provided `title` doubles as the hover-text
  // when consumers add a wrapping `<span title>` outside; here we only
  // own the chip itself.
  const aria = title ? `${version} — ${title}` : version
  return (
    <XStack
      px="$2"
      py={3}
      rounded="$2"
      borderWidth={1}
      borderColor="$borderColor"
      bg={'rgba(255,255,255,0.02)' as never}
      items="center"
      aria-label={aria}
      data-testid="version-badge"
    >
      <Text
        fontSize={10}
        color="$placeholderColor"
        fontFamily={'ui-monospace, SFMono-Regular, monospace' as never}
      >
        {version}
      </Text>
    </XStack>
  )
}
