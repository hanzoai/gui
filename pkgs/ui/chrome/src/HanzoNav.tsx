'use client'

/**
 * HanzoNav — the openai.com-style public header: brand mark + collapsing
 * wordmark, hover-driven full-width mega-menu, "Log in" + primary-CTA dropdowns,
 * and a full-screen mobile drawer. Monochrome zinc-on-black, Geist.
 *
 * Presentational + host-agnostic: nav items, login links, the primary CTA and
 * its analytics callback are all injected as props. Built entirely from Tamagui
 * `styled()` atoms (see ./styles) + @hanzogui/lucide-icons-2.
 */

import { useState, useRef, useEffect, type ReactNode } from 'react'
import { Search, ChevronDown, ArrowUpRight, Menu, X } from '@hanzogui/lucide-icons-2'
import { styled, View } from '@hanzogui/web'
import { XStack, YStack } from '@hanzogui/stacks'
import { Txt, Surface, MenuRow, IconBtn, Divider, useIsWide, useReveal } from './styles'
import { c, SM } from './tokens'
import type { NavItem, NavLink } from './types'

/** Focus the hero composer (openai's magnifying glass drops you into the ask box). */
function focusComposer() {
  if (typeof document === 'undefined') return
  window.scrollTo({ top: 0, behavior: 'smooth' })
  const el = document.getElementById('ask') as HTMLTextAreaElement | null
  el?.focus()
}

export interface HanzoNavLoginProps {
  /** Trigger label. Defaults to "Log in". */
  label?: string
  links: NavLink[]
}

export interface HanzoNavPrimaryProps {
  /** CTA label, e.g. "Try Hanzo". */
  label: string
  /** Where the CTA navigates (the ONE uniform primary action). */
  href: string
  /** Optional dropdown of surfaces under the CTA. */
  links?: NavLink[]
}

export interface HanzoNavProps {
  /** Top-level nav items (mega-menus or simple links). */
  items: NavItem[]
  /** Brand mark rendered left of the wordmark — pass e.g. <HanzoLogo variant="white" size={22} />. */
  logo?: ReactNode
  /** Wordmark next to the logo; collapses to just the mark on scroll. Defaults to "Hanzo AI". */
  brand?: string
  /** Home link target for the logo/wordmark. Defaults to "/". */
  homeHref?: string
  /** "Log in" dropdown (omit to hide). */
  login?: HanzoNavLoginProps
  /** The single primary CTA ("Try Hanzo") + optional dropdown. */
  primary: HanzoNavPrimaryProps
  /** Fired when the primary CTA is activated — wire analytics here (host-owned). */
  onPrimary?: () => void
  /** Search-button behaviour. Defaults to focusing the #ask hero composer. */
  onSearch?: () => void
}

/* ── styled atoms (nav-local) ────────────────────────────────────────────────── */

const Bar = styled(View, {
  name: 'ChromeBar',
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 50,
  borderBottomWidth: 1,
  borderColor: c.lineBar,
  backgroundColor: c.barBg,
})

const Inner = styled(XStack, {
  name: 'ChromeNavInner',
  width: '100%',
  maxWidth: 1280,
  marginHorizontal: 'auto',
  height: 64,
  alignItems: 'center',
  gap: 8,
  paddingHorizontal: 24,
})

const BrandLink = styled(XStack, {
  name: 'ChromeBrandLink',
  tag: 'a',
  cursor: 'pointer',
  alignItems: 'center',
  flexShrink: 0,
})

/** A hover/active-lift text trigger (nav item, login). Colour cascades to child text + icons. */
const Trigger = styled(XStack, {
  name: 'ChromeTrigger',
  tag: 'button',
  cursor: 'pointer',
  alignItems: 'center',
  gap: 4,
  borderRadius: 9999,
  paddingHorizontal: 12,
  paddingVertical: 8,
  backgroundColor: 'transparent',
  color: c.fgMuted,
  hoverStyle: { color: c.fg },
  variants: {
    active: { true: { color: c.fg } },
  } as const,
})

const Cta = styled(XStack, {
  name: 'ChromeCta',
  tag: 'a',
  cursor: 'pointer',
  alignItems: 'center',
  gap: 4,
  backgroundColor: c.ctaBg,
  borderRadius: 9999,
  paddingHorizontal: 16,
  paddingVertical: 8,
  hoverStyle: { opacity: 0.9 },
})

const Panel = styled(View, {
  name: 'ChromeMegaPanel',
  position: 'absolute',
  top: '100%',
  left: 0,
  right: 0,
  borderBottomWidth: 1,
  borderColor: c.line,
  backgroundColor: c.bg,
  shadowColor: '#000',
  shadowOpacity: 0.5,
  shadowRadius: 50,
  shadowOffset: { width: 0, height: 24 },
})

const DropWrap = styled(View, { name: 'ChromeDropWrap', position: 'relative' })

const Drop = styled(View, {
  name: 'ChromeDrop',
  position: 'absolute',
  top: '100%',
  right: 0,
  paddingTop: 12,
})

const Drawer = styled(View, {
  name: 'ChromeDrawer',
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 60,
  backgroundColor: c.bg,
})

const BLUR = { backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' } as const
const BLUR_XL = { backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' } as const

/* ── mega panel ──────────────────────────────────────────────────────────────── */

function MegaPanel({ item }: { item: NavItem }) {
  const explore = item.explore ?? []
  const columns = item.columns ?? []
  const reveal = useReveal({ y: -4 })
  return (
    <Panel style={reveal}>
      <XStack
        width="100%"
        maxWidth={1280}
        marginHorizontal="auto"
        paddingHorizontal={24}
        paddingVertical={40}
        gap={40}
        flexDirection="row"
      >
        {/* Explore — big links. */}
        <YStack flexBasis="34%" minWidth={0} gap={2}>
          <Txt role="kicker" marginBottom={12} letterSpacing={1.6}>
            Explore {item.label}
          </Txt>
          {explore.map((l) => (
            <MenuRow key={l.label} href={l.href} paddingHorizontal={8} paddingVertical={6} marginHorizontal={-8}>
              <Txt role="explore">{l.label}</Txt>
              {l.desc ? <Txt role="desc">{l.desc}</Txt> : null}
            </MenuRow>
          ))}
        </YStack>

        {/* Secondary columns. */}
        {columns.length > 0 ? (
          <XStack flex={1} gap={32}>
            {columns.map((col) => (
              <YStack key={col.title} flex={1} minWidth={0}>
                <Txt role="kicker" marginBottom={12} letterSpacing={1.6}>
                  {col.title}
                </Txt>
                <YStack gap={2}>
                  {col.links.map((link) => (
                    <MenuRow key={link.label} href={link.href} paddingHorizontal={8} marginHorizontal={-8}>
                      <Txt role="strong">{link.label}</Txt>
                      {link.desc ? <Txt role="desc" marginTop={2}>{link.desc}</Txt> : null}
                    </MenuRow>
                  ))}
                </YStack>
              </YStack>
            ))}
          </XStack>
        ) : null}
      </XStack>
    </Panel>
  )
}

/* ── dropdown (login / primary) ──────────────────────────────────────────────── */

function LinkDrop({ links, minWidth, withDesc }: { links: NavLink[]; minWidth: number; withDesc?: boolean }) {
  const reveal = useReveal({ y: 6 })
  return (
    <Drop minWidth={minWidth} style={reveal}>
      <Surface style={BLUR_XL}>
        {links.map((l) => (
          <MenuRow key={l.label} href={l.href} paddingVertical={withDesc ? 10 : 8}>
            <Txt role="strong">{l.label}</Txt>
            {withDesc && l.desc ? <Txt role="desc" marginTop={2}>{l.desc}</Txt> : null}
          </MenuRow>
        ))}
      </Surface>
    </Drop>
  )
}

/* ── component ───────────────────────────────────────────────────────────────── */

export function HanzoNav({
  items,
  logo,
  brand = 'Hanzo AI',
  homeHref = '/',
  login,
  primary,
  onPrimary,
  onSearch,
}: HanzoNavProps) {
  const [open, setOpen] = useState<string | null>(null)
  const [mobile, setMobile] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const [tryOpen, setTryOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const wide = useIsWide()
  const showSm = useIsWide(SM)

  const onTry = () => onPrimary?.()
  const onSearchClick = onSearch ?? focusComposer

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    document.body.style.overflow = mobile ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobile])

  // Collapse the wordmark to just the mark once you scroll.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const openMenu = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setOpen(label)
  }
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(() => setOpen(null), 120)
  }

  const activeItem = items.find((i) => i.label === open && !i.href) ?? null
  const loginLinks = login?.links ?? []
  const tryLinks = primary.links ?? []

  const wordmarkStyle = {
    overflow: 'hidden' as const,
    whiteSpace: 'nowrap' as const,
    opacity: scrolled ? 0 : 1,
    maxWidth: scrolled ? 0 : 160,
    marginLeft: scrolled ? 0 : 8,
    transition: 'opacity 250ms ease-in-out, max-width 250ms ease-in-out, margin-left 250ms ease-in-out',
  }

  return (
    <>
      <Bar onHoverOut={scheduleClose} style={BLUR}>
        <Inner>
          {/* Left: logo + desktop nav */}
          <BrandLink href={homeHref} aria-label={`${brand} home`}>
            {logo}
            <Txt role="wordmark" style={wordmarkStyle}>
              {brand}
            </Txt>
          </BrandLink>

          {wide ? (
            <XStack marginLeft={16} alignItems="center">
              {items.map((item) =>
                item.href ? (
                  <Trigger
                    key={item.label}
                    tag="a"
                    href={item.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    gap={2}
                  >
                    <Txt role="inherit">{item.label}</Txt>
                    <ArrowUpRight size={14} color={c.fgDim} />
                  </Trigger>
                ) : (
                  <Trigger
                    key={item.label}
                    active={open === item.label}
                    onHoverIn={() => openMenu(item.label)}
                    onFocus={() => openMenu(item.label)}
                  >
                    <Txt role="inherit">{item.label}</Txt>
                    <ChevronDown size={14} color={c.fgDim} />
                  </Trigger>
                ),
              )}
            </XStack>
          ) : null}

          {/* Right: search + login + primary CTA */}
          <XStack marginLeft="auto" alignItems="center" gap={8}>
            {showSm ? (
              <IconBtn onPress={onSearchClick} aria-label="Search">
                <Search size={16} color="currentColor" />
              </IconBtn>
            ) : null}

            {showSm && loginLinks.length > 0 ? (
              <DropWrap onHoverIn={() => setLoginOpen(true)} onHoverOut={() => setLoginOpen(false)}>
                <Trigger tag="button" active={loginOpen}>
                  <Txt role="inherit">{login?.label ?? 'Log in'}</Txt>
                  <ChevronDown size={14} color={c.fgDim} />
                </Trigger>
                {loginOpen ? <LinkDrop links={loginLinks} minWidth={192} /> : null}
              </DropWrap>
            ) : null}

            <DropWrap onHoverIn={() => setTryOpen(true)} onHoverOut={() => setTryOpen(false)}>
              <Cta href={primary.href} onPress={onTry} aria-haspopup="true">
                <Txt role="inherit" color={c.ctaFg} fontWeight="500">
                  {primary.label}
                </Txt>
                {tryLinks.length > 0 ? <ChevronDown size={16} color={c.ctaFg} /> : null}
              </Cta>
              {tryLinks.length > 0 && tryOpen ? <LinkDrop links={tryLinks} minWidth={272} withDesc /> : null}
            </DropWrap>

            {!wide ? (
              <IconBtn onPress={() => setMobile(true)} aria-label="Open menu">
                <Menu size={20} color="currentColor" />
              </IconBtn>
            ) : null}
          </XStack>
        </Inner>

        {/* Full-width mega panel (desktop). */}
        {wide && activeItem ? <MegaPanel item={activeItem} /> : null}
      </Bar>

      {/* Mobile drawer — sibling of the bar (the bar's backdrop-blur traps position:fixed children). */}
      {!wide && mobile ? (
        <Drawer style={useReveal({ duration: 200 })}>
          <XStack
            height={64}
            alignItems="center"
            justifyContent="space-between"
            borderBottomWidth={1}
            borderColor={c.lineBar}
            paddingHorizontal={16}
          >
            <BrandLink href={homeHref} aria-label={`${brand} home`} gap={8}>
              {logo}
              <Txt role="wordmark">{brand}</Txt>
            </BrandLink>
            <IconBtn onPress={() => setMobile(false)} aria-label="Close menu">
              <X size={20} color="currentColor" />
            </IconBtn>
          </XStack>

          <View
            paddingHorizontal={16}
            paddingVertical={24}
            style={{ height: 'calc(100dvh - 64px)', overflowY: 'auto' }}
          >
            <Cta href={primary.href} onPress={onTry} justifyContent="center" marginBottom={24} paddingVertical={12}>
              <Txt role="inherit" color={c.ctaFg} fontWeight="500">
                {primary.label}
              </Txt>
              <ArrowUpRight size={16} color={c.ctaFg} />
            </Cta>

            {items.map((item) => (
              <MobileSection key={item.label} item={item} />
            ))}

            {loginLinks.length > 0 ? (
              <YStack marginTop={24} paddingTop={24} borderTopWidth={1} borderColor={c.line}>
                <Txt role="kicker" marginBottom={8}>
                  {login?.label ?? 'Log in'}
                </Txt>
                {loginLinks.map((l) => (
                  <MenuRow key={l.label} href={l.href} paddingHorizontal={0}>
                    <Txt role="body" color={c.fgBody} fontSize={15}>
                      {l.label}
                    </Txt>
                  </MenuRow>
                ))}
              </YStack>
            ) : null}
          </View>
        </Drawer>
      ) : null}
    </>
  )
}

/* ── mobile accordion section ────────────────────────────────────────────────── */

function MobileSection({ item }: { item: NavItem }) {
  const [expanded, setExpanded] = useState(false)

  if (item.href) {
    return (
      <XStack
        tag="a"
        href={item.href}
        target="_blank"
        rel="noreferrer noopener"
        alignItems="center"
        justifyContent="space-between"
        paddingVertical={14}
        borderBottomWidth={1}
        borderColor={c.lineSoft}
        cursor="pointer"
      >
        <Txt role="mobile">{item.label}</Txt>
        <ArrowUpRight size={16} color={c.fgDim} />
      </XStack>
    )
  }

  return (
    <YStack borderBottomWidth={1} borderColor={c.lineSoft}>
      <XStack
        tag="button"
        onPress={() => setExpanded((v) => !v)}
        alignItems="center"
        justifyContent="space-between"
        paddingVertical={14}
        cursor="pointer"
        backgroundColor="transparent"
      >
        <Txt role="mobile">{item.label}</Txt>
        <View
          style={{
            transform: expanded ? 'rotate(180deg)' : 'none',
            transition: 'transform 200ms ease',
          }}
        >
          <ChevronDown size={16} color={c.fgDim} />
        </View>
      </XStack>
      {expanded ? (
        <YStack paddingBottom={12} style={useReveal({ y: -4 })}>
          {(item.explore ?? []).map((l) => (
            <MenuRow key={l.label} href={l.href} paddingHorizontal={8} paddingVertical={6}>
              <Txt role="mobile">{l.label}</Txt>
            </MenuRow>
          ))}
          {(item.columns ?? []).map((col) => (
            <YStack key={col.title} marginTop={12} marginBottom={12}>
              <Txt role="kicker" color={c.fgFaint} marginBottom={4} paddingHorizontal={8}>
                {col.title}
              </Txt>
              {col.links.map((link) => (
                <MenuRow key={link.label} href={link.href} paddingHorizontal={8} paddingVertical={6}>
                  <Txt role="body">{link.label}</Txt>
                </MenuRow>
              ))}
            </YStack>
          ))}
        </YStack>
      ) : null}
    </YStack>
  )
}
