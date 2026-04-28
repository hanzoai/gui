// Breadcrumbs — chevron-separated trail of links. Hanzo GUI native port
// of upstream `temporal/ui` `breadcrumbs.svelte`. Each crumb is either a
// React Router target (`to`) or a terminal (no `to` -> rendered as
// non-interactive current-page text). The last crumb is always rendered
// as text regardless of `to` to match accessibility expectations
// (aria-current="page").

import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Text, XStack } from 'hanzogui'
import { ChevronRight } from '@hanzogui/lucide-icons-2/icons/ChevronRight'

export interface Crumb {
  label: string
  to?: string
}

export interface BreadcrumbsProps {
  items: Crumb[]
  // Optional separator override — defaults to a 12px ChevronRight.
  separator?: ReactNode
}

export function Breadcrumbs({ items, separator }: BreadcrumbsProps) {
  if (items.length === 0) return null
  const sep =
    separator ?? <ChevronRight size={12} color="#7e8794" aria-hidden />
  return (
    <XStack
      items="center"
      gap="$1.5"
      role={'navigation' as never}
      aria-label="Breadcrumb"
    >
      {items.map((crumb, idx) => {
        const isLast = idx === items.length - 1
        return (
          <XStack key={`${crumb.label}-${idx}`} items="center" gap="$1.5">
            {idx > 0 ? sep : null}
            {isLast || !crumb.to ? (
              <Text
                fontSize="$2"
                color="$color"
                fontWeight={isLast ? '600' : '400'}
                aria-current={isLast ? 'page' : undefined}
              >
                {crumb.label}
              </Text>
            ) : (
              <Link to={crumb.to} style={{ textDecoration: 'none' }}>
                <Text
                  fontSize="$2"
                  color="$placeholderColor"
                  hoverStyle={{ color: '$color' as never }}
                >
                  {crumb.label}
                </Text>
              </Link>
            )}
          </XStack>
        )
      })}
    </XStack>
  )
}
