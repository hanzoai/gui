// Sidebar — left chrome for an admin app. Three sections:
//   1. brand row (mark + title + sub-title)
//   2. nav groups (top primary, divider, secondary, externals)
//   3. footer (feedback link + version)
//
// All content is data-driven via SidebarConfig — the chrome itself is
// app-agnostic. Each consumer wires its own NavLink targets.

import type { ComponentType, ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import { Text, XStack, YStack } from 'hanzogui'

// Accept any icon component — including @hanzogui/lucide-icons-2 (whose
// `color` is typed as a Hanzo GUI theme token), plain SVG components, and
// anything that takes `size` + `color`. Runtime renders with hex color
// strings, which Hanzo GUI accepts via the CSS pass-through. The shell
// never reads icon-specific props, so a permissive type is correct.
export type IconComponent = ComponentType<any>

export interface NavItem {
  to: string
  icon: IconComponent
  label: string
  end?: boolean
  disabled?: boolean
}

export interface NavExternal {
  href: string
  icon: IconComponent
  label: string
}

export interface SidebarSection {
  // Items in display order. Rendered as a vertical group.
  items: Array<NavItem | NavExternal>
}

export interface SidebarFooter {
  // Feedback / issue link in the footer. Rendered as text + icon.
  feedback?: { href: string; label: string; icon: IconComponent }
  // Version string ("v2.45.3") shown beneath feedback. Format is
  // caller-controlled — admin app reads VITE_APP_VERSION etc.
  version?: string
}

export interface SidebarBrand {
  // Brand mark slot — caller renders the mark. Sized 28×28.
  mark: ReactNode
  title: string
  subtitle?: string
}

export interface SidebarConfig {
  brand: SidebarBrand
  sections: SidebarSection[]
  footer?: SidebarFooter
  // Optional override for sidebar width (default 224px).
  width?: number
}

export function Sidebar({ config }: { config: SidebarConfig }) {
  return (
    <YStack
      width={config.width ?? 224}
      height="100vh"
      borderRightWidth={1}
      borderRightColor="$borderColor"
      bg={'rgba(7,11,19,0.6)' as never}
    >
      {/* Brand row */}
      <XStack
        px="$4"
        py="$3"
        borderBottomWidth={1}
        borderBottomColor="$borderColor"
        items="center"
        gap="$2"
      >
        {config.brand.mark}
        <YStack>
          <Text fontSize="$3" fontWeight="600" color="$color" letterSpacing={-0.2}>
            {config.brand.title}
          </Text>
          {config.brand.subtitle ? (
            <Text
              fontSize={9}
              color="$placeholderColor"
              letterSpacing={1.2}
              textTransform={'uppercase' as any}
            >
              {config.brand.subtitle}
            </Text>
          ) : null}
        </YStack>
      </XStack>

      {/* Sections — sections are separated by a divider */}
      <YStack flex={1} p="$2" gap="$1">
        {config.sections.map((section, sIdx) => (
          <YStack key={sIdx} gap="$1">
            {sIdx > 0 ? (
              <YStack my="$3" borderTopWidth={1} borderTopColor="$borderColor" />
            ) : null}
            {section.items.map((item, iIdx) =>
              isExternal(item) ? (
                <ExternalRow key={iIdx} item={item} />
              ) : (
                <NavRow key={iIdx} item={item} />
              ),
            )}
          </YStack>
        ))}
      </YStack>

      {/* Footer */}
      {config.footer ? (
        <YStack
          px="$3"
          py="$3"
          borderTopWidth={1}
          borderTopColor="$borderColor"
          gap="$1"
        >
          {config.footer.feedback ? (
            <a
              href={config.footer.feedback.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none' }}
            >
              <XStack items="center" gap="$1.5">
                <config.footer.feedback.icon size={12} color="#7e8794" />
                <Text fontSize="$1" color="$placeholderColor">
                  {config.footer.feedback.label}
                </Text>
              </XStack>
            </a>
          ) : null}
          {config.footer.version ? (
            <Text fontSize={10} color="$placeholderColor" opacity={0.6}>
              {config.footer.version}
            </Text>
          ) : null}
        </YStack>
      ) : null}
    </YStack>
  )
}

function isExternal(item: NavItem | NavExternal): item is NavExternal {
  return 'href' in item
}

function NavRow({ item }: { item: NavItem }) {
  const Icon = item.icon
  if (item.disabled) {
    return (
      <XStack
        items="center"
        gap="$2"
        px="$3"
        py="$2"
        rounded="$3"
        opacity={0.4}
        cursor="not-allowed"
      >
        <Icon size={16} color="#7e8794" />
        <Text fontSize="$2" color="$placeholderColor">
          {item.label}
        </Text>
      </XStack>
    )
  }
  return (
    <NavLink to={item.to} end={item.end} style={{ textDecoration: 'none' }}>
      {({ isActive }) => (
        <XStack
          items="center"
          gap="$2"
          px="$3"
          py="$2"
          rounded="$3"
          bg={isActive ? ('rgba(255,255,255,0.06)' as never) : 'transparent'}
          hoverStyle={{ background: 'rgba(255,255,255,0.04)' as never }}
        >
          <Icon size={16} color={isActive ? '#f2f2f2' : '#7e8794'} />
          <Text fontSize="$2" color={isActive ? '$color' : '$placeholderColor'}>
            {item.label}
          </Text>
        </XStack>
      )}
    </NavLink>
  )
}

function ExternalRow({ item }: { item: NavExternal }) {
  const Icon = item.icon
  return (
    <a href={item.href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
      <XStack
        items="center"
        gap="$2"
        px="$3"
        py="$2"
        rounded="$3"
        hoverStyle={{ background: 'rgba(255,255,255,0.04)' as never }}
      >
        <Icon size={16} color="#7e8794" />
        <Text fontSize="$2" color="$placeholderColor">
          {item.label}
        </Text>
      </XStack>
    </a>
  )
}
