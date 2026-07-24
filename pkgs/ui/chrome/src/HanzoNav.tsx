'use client'

import { useState, useEffect, useRef, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ChevronDown, ArrowUpRight, Menu, X } from 'lucide-react'
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

/**
 * The FULL-WIDTH mega panel — an openai.com-style dropout below the header bar,
 * spanning the viewport, with a big "Explore <section>" links column on the left
 * and secondary link columns on the right.
 */
function MegaPanel({ item }: { item: NavItem }) {
  const explore = item.explore ?? []
  const columns = item.columns ?? []
  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.15 }}
      className="absolute inset-x-0 top-full border-b border-neutral-800 bg-black shadow-2xl"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-10 sm:px-6 md:grid-cols-[minmax(0,1.1fr)_minmax(0,2fr)] lg:px-8">
        {/* Explore — big links. */}
        <div>
          <div className="mb-5 text-xs font-medium uppercase tracking-widest text-neutral-500">Explore {item.label}</div>
          <ul className="space-y-0.5">
            {explore.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  className="group flex flex-col rounded-lg px-2 py-1.5 -mx-2 transition-colors hover:bg-neutral-900"
                >
                  <span className="text-2xl font-medium text-white">{l.label}</span>
                  {l.desc && <span className="text-xs text-neutral-500">{l.desc}</span>}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Secondary columns. */}
        {columns.length > 0 && (
          <div className="grid gap-8" style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0,1fr))` }}>
            {columns.map((col) => (
              <div key={col.title}>
                <div className="mb-3 text-xs font-medium uppercase tracking-widest text-neutral-500">{col.title}</div>
                <ul className="space-y-1">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <a href={link.href} className="block rounded-lg px-2 py-1.5 -mx-2 transition-colors hover:bg-neutral-900">
                        <span className="text-sm font-medium text-neutral-100">{link.label}</span>
                        {link.desc && <span className="mt-0.5 block text-xs text-neutral-500">{link.desc}</span>}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}

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

  const onTry = () => onPrimary?.()
  const onSearchClick = onSearch ?? focusComposer

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    document.body.style.overflow = mobile ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobile])

  // Collapse the wordmark to just the mark once you scroll (matches
  // cloud.hanzo.ai, which collapses "Hanzo Cloud" → H).
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

  return (
    <>
      {/* The header owns the full-width panel: hovering a top item opens it below the
          bar, and leaving the whole header (bar + panel) closes it. */}
      <header
        className="fixed inset-x-0 top-0 z-50 border-b border-neutral-800/80 bg-black/70 backdrop-blur-md"
        onMouseLeave={scheduleClose}
      >
        <nav className="mx-auto flex h-16 max-w-7xl items-center gap-2 px-4 sm:px-6 lg:px-8">
          {/* Left: logo + desktop nav */}
          <a href={homeHref} className="flex flex-shrink-0 items-center" aria-label={`${brand} home`}>
            {logo}
            <motion.span
              initial={false}
              animate={{ opacity: scrolled ? 0 : 1, width: scrolled ? 0 : 'auto', marginLeft: scrolled ? 0 : 8 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="overflow-hidden whitespace-nowrap text-[15px] font-semibold tracking-tight text-white"
            >
              {brand}
            </motion.span>
          </a>

          <div className="ml-4 hidden items-center lg:flex">
            {items.map((item) =>
              item.href ? (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-0.5 rounded-full px-3 py-2 text-sm text-neutral-300 transition-colors hover:text-white"
                >
                  {item.label}
                  <ArrowUpRight className="h-3.5 w-3.5 text-neutral-500" />
                </a>
              ) : (
                <button
                  key={item.label}
                  className={`inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm transition-colors hover:text-white ${open === item.label ? 'text-white' : 'text-neutral-300'}`}
                  aria-expanded={open === item.label}
                  onMouseEnter={() => openMenu(item.label)}
                  onFocus={() => openMenu(item.label)}
                >
                  {item.label}
                  <ChevronDown className="h-3.5 w-3.5 text-neutral-500" />
                </button>
              ),
            )}
          </div>

          {/* Right: search + login + primary CTA */}
          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <button
              onClick={onSearchClick}
              aria-label="Search"
              className="hidden rounded-full p-2 text-neutral-300 transition-colors hover:bg-neutral-900 hover:text-white sm:inline-flex"
            >
              <Search className="h-4 w-4" />
            </button>

            {loginLinks.length > 0 && (
              <div className="relative hidden sm:block" onMouseEnter={() => setLoginOpen(true)} onMouseLeave={() => setLoginOpen(false)}>
                <button className="inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm text-neutral-300 transition-colors hover:text-white" aria-expanded={loginOpen}>
                  {login?.label ?? 'Log in'}
                  <ChevronDown className="h-3.5 w-3.5 text-neutral-500" />
                </button>
                <AnimatePresence>
                  {loginOpen && (
                    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} transition={{ duration: 0.15 }} className="absolute right-0 top-full min-w-[12rem] pt-3">
                      <div className="rounded-2xl border border-neutral-800 bg-neutral-950/95 p-2 shadow-2xl backdrop-blur-xl">
                        {loginLinks.map((l) => (
                          <a key={l.label} href={l.href} className="block rounded-lg px-3 py-2 text-sm font-medium text-neutral-100 transition-colors hover:bg-neutral-900">
                            {l.label}
                          </a>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* The ONE uniform primary CTA, as a nice dropdown. */}
            <div className="relative" onMouseEnter={() => setTryOpen(true)} onMouseLeave={() => setTryOpen(false)}>
              <a
                href={primary.href}
                onClick={onTry}
                className="inline-flex items-center gap-1 rounded-full bg-white px-4 py-2 text-sm font-medium text-black transition-opacity hover:opacity-90"
                aria-haspopup="true"
                aria-expanded={tryOpen}
              >
                {primary.label}
                {tryLinks.length > 0 && <ChevronDown className="h-4 w-4" />}
              </a>
              {tryLinks.length > 0 && (
                <AnimatePresence>
                  {tryOpen && (
                    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} transition={{ duration: 0.15 }} className="absolute right-0 top-full min-w-[17rem] pt-3">
                      <div className="rounded-2xl border border-neutral-800 bg-neutral-950/95 p-2 shadow-2xl backdrop-blur-xl">
                        {tryLinks.map((l) => (
                          <a key={l.label} href={l.href} className="block rounded-lg px-3 py-2.5 transition-colors hover:bg-neutral-900">
                            <span className="text-sm font-medium text-neutral-100">{l.label}</span>
                            {l.desc && <span className="mt-0.5 block text-xs text-neutral-500">{l.desc}</span>}
                          </a>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>

            <button onClick={() => setMobile(true)} aria-label="Open menu" className="rounded-full p-2 text-neutral-200 transition-colors hover:bg-neutral-900 lg:hidden">
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </nav>

        {/* Full-width mega panel (desktop). */}
        <div className="hidden lg:block">
          <AnimatePresence>{activeItem && <MegaPanel item={activeItem} />}</AnimatePresence>
        </div>
      </header>

      {/* Mobile drawer — sibling of <header> (the header's backdrop-blur traps
          position:fixed children). */}
      <AnimatePresence>
        {mobile && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} style={{ zIndex: 60 }} className="fixed inset-0 bg-black lg:hidden">
            <div className="flex h-16 items-center justify-between border-b border-neutral-800/80 px-4">
              <a href={homeHref} className="flex items-center gap-2" aria-label={`${brand} home`}>
                {logo}
                <span className="ml-2 text-[15px] font-semibold tracking-tight text-white">{brand}</span>
              </a>
              <button onClick={() => setMobile(false)} aria-label="Close menu" className="rounded-full p-2 text-neutral-200 transition-colors hover:bg-neutral-900">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="h-[calc(100dvh-4rem)] overflow-y-auto px-4 py-6">
              <a href={primary.href} onClick={onTry} className="mb-6 inline-flex w-full items-center justify-center gap-1 rounded-full bg-white px-4 py-3 text-sm font-medium text-black">
                {primary.label} <ArrowUpRight className="h-4 w-4" />
              </a>

              {items.map((item) => (
                <MobileSection key={item.label} item={item} />
              ))}

              {loginLinks.length > 0 && (
                <div className="mt-6 border-t border-neutral-800 pt-6">
                  <div className="mb-2 text-xs font-medium uppercase tracking-wide text-neutral-500">{login?.label ?? 'Log in'}</div>
                  {loginLinks.map((l) => (
                    <a key={l.label} href={l.href} className="block py-2 text-[15px] text-neutral-200">
                      {l.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function MobileSection({ item }: { item: NavItem }) {
  const [expanded, setExpanded] = useState(false)

  if (item.href) {
    return (
      <a href={item.href} target="_blank" rel="noreferrer noopener" className="flex items-center justify-between border-b border-neutral-900 py-3.5 text-[15px] font-medium text-neutral-100">
        {item.label}
        <ArrowUpRight className="h-4 w-4 text-neutral-500" />
      </a>
    )
  }

  return (
    <div className="border-b border-neutral-900">
      <button onClick={() => setExpanded((v) => !v)} className="flex w-full items-center justify-between py-3.5 text-[15px] font-medium text-neutral-100" aria-expanded={expanded}>
        {item.label}
        <ChevronDown className={`h-4 w-4 text-neutral-500 transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
            <div className="pb-3">
              {(item.explore ?? []).map((l) => (
                <a key={l.label} href={l.href} className="block py-1.5 pl-2 text-[15px] font-medium text-neutral-100">
                  {l.label}
                </a>
              ))}
              {(item.columns ?? []).map((col) => (
                <div key={col.title} className="mb-3 mt-3">
                  <div className="mb-1 text-xs font-medium uppercase tracking-wide text-neutral-600">{col.title}</div>
                  {col.links.map((link) => (
                    <a key={link.label} href={link.href} className="block py-1.5 pl-2 text-sm text-neutral-300">
                      {link.label}
                    </a>
                  ))}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
