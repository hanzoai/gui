// TopBar — right chrome for an admin app. Hosts:
//   - left:  optional namespace/tenant switcher
//   - right: optional clock toggle, theme toggle, account chip
//
// The TopBar itself is a thin layout shell; each piece is a separate
// component the caller can pick from. We do not assume namespaces
// exist — kms, commerce, console all swap that slot for whatever
// scoping makes sense for them.

import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Popover, Text, XStack, YStack } from 'hanzogui'
import {
  ChevronDown,
  Clock,
  ExternalLink,
  LogOut,
  Moon,
  Sun,
  User,
} from '@hanzogui/lucide-icons-2'
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
}

export function NamespaceSwitcher({
  active,
  options,
  hrefFor,
  allHref,
  docsHref,
  placeholder = 'default',
  groupLabel = 'Switch namespace',
}: NamespaceSwitcherProps) {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
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
          minW={220}
          elevate
        >
          <YStack gap="$1">
            <Text px="$2" py="$1" fontSize="$1" color="$placeholderColor" fontWeight="500">
              {groupLabel}
            </Text>
            <YStack borderBottomWidth={1} borderBottomColor="$borderColor" my="$1" />
            {options.length === 0 ? (
              <Text px="$2" py="$1.5" fontSize="$2" color="$placeholderColor" opacity={0.6}>
                None available
              </Text>
            ) : (
              options.map((opt) => {
                const isActive = opt.id === active
                return (
                  <PopoverRow
                    key={opt.id}
                    onPress={() => {
                      setOpen(false)
                      navigate(hrefFor(opt.id))
                    }}
                  >
                    <Text fontSize="$2" fontWeight={isActive ? '600' : '400'} color="$color">
                      {opt.label}
                    </Text>
                  </PopoverRow>
                )
              })
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
