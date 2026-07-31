'use client'

/**
 * HanzoFooter — the minimal monochrome footer: brand + tagline, link columns,
 * copyright, and an optional GitHub mark. Data-driven via props.
 */

import { type ReactNode } from 'react'
import { Github } from '@hanzogui/lucide-icons-2'
import { styled, View } from '@hanzogui/web'
import { XStack, YStack } from '@hanzogui/stacks'
import { Txt, LinkText, linkable, useHover, useIsWide } from './styles'
import { c } from './tokens'
import type { NavColumn } from './types'

export interface HanzoFooterProps {
  /** Footer link columns. */
  sections: NavColumn[]
  /** Brand mark rendered left of the wordmark — pass e.g. <HanzoLogo variant="white" size={22} />. */
  logo?: ReactNode
  /** Wordmark. Defaults to "Hanzo". */
  brand?: string
  /** One-line tagline under the brand. Defaults to "The open-source cloud for AI agents.". */
  tagline?: string
  /** Home link target. Defaults to "/". */
  homeHref?: string
  /** Legal entity in the copyright line. Defaults to "Hanzo AI, Inc.". */
  legalName?: string
  /** GitHub link (renders the mark). Omit to hide. */
  githubHref?: string
}

const FooterFrame = styled(View, {
  name: 'ChromeFooter',
  render: 'footer',
  borderTopWidth: 1,
  borderColor: c.lineSoft,
  paddingHorizontal: 24,
  paddingVertical: 56,
})

const BrandRow = linkable(
  styled(XStack, {
    name: 'ChromeFooterBrand',
    render: 'a',
    cursor: 'pointer',
    alignItems: 'center',
    gap: 8,
  }),
)

const GhFrame = linkable(
  styled(View, {
    name: 'ChromeGh',
    render: 'a',
    cursor: 'pointer',
    alignItems: 'center',
    justifyContent: 'center',
  }),
)

function GithubLink({ href, label }: { href: string; label: string }) {
  const { hovered, onMouseEnter, onMouseLeave } = useHover()
  return (
    <GhFrame href={href} target="_blank" rel="noreferrer noopener" aria-label={label} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <Github size={20} color={hovered ? c.fg : c.fgDim} />
    </GhFrame>
  )
}

export function HanzoFooter({
  sections,
  logo,
  brand = 'Hanzo',
  tagline = 'The open-source cloud for AI agents.',
  homeHref = '/',
  legalName = 'Hanzo AI, Inc.',
  githubHref,
}: HanzoFooterProps) {
  const wide = useIsWide()
  const year = new Date().getFullYear()

  return (
    <FooterFrame>
      <YStack width="100%" maxWidth={1152} marginHorizontal="auto">
        <XStack flexWrap="wrap" gap={40} flexDirection={wide ? 'row' : 'column'}>
          <YStack width={wide ? 220 : '100%'}>
            <BrandRow href={homeHref} aria-label={`${brand} home`}>
              {logo}
              <Txt kind="wordmark">{brand}</Txt>
            </BrandRow>
            <Txt kind="dim" marginTop={12} maxWidth={256}>
              {tagline}
            </Txt>
          </YStack>

          {sections.map((col) => (
            <YStack key={col.title} flexGrow={1} minWidth={140}>
              <Txt kind="kicker" marginBottom={12}>
                {col.title}
              </Txt>
              <YStack gap={8}>
                {col.links.map((link) => (
                  <LinkText key={link.label} href={link.href}>
                    {link.label}
                  </LinkText>
                ))}
              </YStack>
            </YStack>
          ))}
        </XStack>

        <XStack
          marginTop={48}
          paddingTop={32}
          borderTopWidth={1}
          borderColor={c.lineSoft}
          flexDirection={wide ? 'row' : 'column'}
          alignItems="center"
          justifyContent="space-between"
          gap={16}
        >
          <Txt kind="dim">
            © {year} {legalName} All rights reserved.
          </Txt>
          {githubHref ? <GithubLink href={githubHref} label={`${brand} on GitHub`} /> : null}
        </XStack>
      </YStack>
    </FooterFrame>
  )
}
