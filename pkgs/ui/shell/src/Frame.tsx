'use client'

/**
 * Frame — the workspace a signed-in Hanzo app wears. ONE of them, for hanzo.ai
 * and the Hanzo App alike, the way claude.ai wears one frame around chat and
 * code.
 *
 *   rail      the sections, as marks. The sidebar SHUT on a laptop, the tab bar
 *             along the bottom of a phone, and — only where the host asks for
 *             it with `strip` — a far-left strip that stands beside the open
 *             sidebar with the host's mark at its head.
 *   bar       the sidebar's handle and history, then the project and
 *             environment (`scope`), the search (`find`), the host's controls.
 *   list      the sidebar: the workspace switcher at the TOP, because switching
 *             it changes everything beneath; the sections; what the section
 *             holds (`list`); the host's rows (`foot`); the account at the foot.
 *   pane      the room.
 *   side      the column beside the room, which the room fills through
 *             <Beside>. A `panel` (a profile, a thread) takes its place.
 *
 * The frame owns the COLUMNS — their widths, their edges, whether they are
 * open — and nothing IN them: no data, no routes, no framework. `navigate` is
 * a prop because moving between rooms is the one thing only a host can do, so
 * the same frame mounts under Next, under Vite, or under a test.
 *
 * Self-contained like the rest of this package: React the only runtime
 * dependency, inline styles and theme.ts tokens, and the layout rules inline
 * styles cannot state in shellStyles.ts.
 */
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentType,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { MARKS } from './glyph.tsx'
import { HanzoMark } from './mark.tsx'
import { useFrameStyles } from './shellStyles.ts'
import { FRAME } from './theme.ts'
import { useMediaQuery } from './useMediaQuery.ts'

/** One place the rail goes. */
export interface Section {
  id: string
  /** The rail's word for it. Short, because it sits under a mark. */
  label: string
  /** Its full name, as the tooltip. Defaults to `label`. */
  title?: string
  /** The mark. Sized by the frame: 16 in a row, 18 on a tile. */
  icon: ComponentType<{ size?: number }>
  /** Where it is. A path goes through `navigate`; an absolute URL is a link. */
  href: string
}

/** The column beside the room. */
export interface Side {
  /** Whether the room has asked for it. */
  open: boolean
  /** Put it away — the frame calls this when its edge is dragged shut. */
  close: () => void
  /** The bar's controls that open it. Drawn only where the column can be. */
  toggles?: ReactNode
}

/** The search in the middle of the bar, and the chord that opens it. */
export interface Find {
  /** What is searched — "Search {label}". */
  label: string
  open: () => void
}

export interface FrameProps {
  sections: Section[]
  /** The section the room belongs to. */
  active?: string
  /** Take the reader to a path. Absent, sections do not move. */
  navigate?: (href: string) => void
  /** Step back through the reader's history. Absent, the arrows are not drawn. */
  back?: () => void
  forward?: () => void
  /** Where the mark at the top of the sidebar goes. */
  home?: string
  /** The workspace switcher, at the top of the sidebar. */
  workspace?: ReactNode
  /** Project and environment: one resource scope, in the bar. */
  scope?: ReactNode
  find?: Find
  /** The host's own controls at the bar's end — a sign-in, say. */
  actions?: ReactNode
  /** What the active section holds: the body of the sidebar. */
  list?: ReactNode
  /** Rows above the account, at the sidebar's foot. */
  foot?: ReactNode
  /** The account card at the bottom of the sidebar. */
  account?: ReactNode
  /** Opens settings. Draws a Settings row in the sidebar and a tile on the rail. */
  settings?: () => void
  /** The phone's More tile, for the sections past the fourth. */
  more?: () => void
  /**
   * The far-left strip, opt-in: its head (an org's mark) over the sections,
   * standing beside the open sidebar. Absent, there is no strip — the sections
   * lead the sidebar and the rail is only the sidebar shut.
   */
  strip?: ReactNode
  side?: Side
  /** A column that takes the side's place: a profile, a thread. */
  panel?: ReactNode
  /** Stamped `data-hydrated` once the host has settled who is reading. */
  ready?: boolean
  /** Passed through to the root. */
  className?: string
  /** The room. */
  children: ReactNode
}

/** Per device. The sidebar a reader shut stays shut. */
const OPEN = 'hanzo:sidebar:open'
/** Per device. A width that resets is a width you set every load. */
const SPAN = 'hanzo.sidebar.span'
const BESIDE = 'hanzo.aside.span'
const FLOOR = 200
const CEIL = 480
/** Below this the sidebar is a sheet and the sections lie along the bottom. */
const WIDE = 768
/** Below this, choosing a row puts the sidebar away: it covers the room. */
const ROOMY = 1024

interface State {
  /** Whether the sidebar is out. */
  open: boolean
  toggle: () => void
  /** A row was chosen: put the sidebar away where it covers the room. */
  pick: () => void
}

const Frames = createContext<State | null>(null)

/**
 * The frame around this component, or null outside one — the account card, for
 * one, also stands alone on a page with no frame.
 */
export function useFrame(): State | null {
  return useContext(Frames)
}

/**
 * Where a room's column goes. The frame owns the COLUMN; the room owns what is
 * in it, so the frame never learns what a room shows beside itself.
 */
const Slot = createContext<HTMLElement | null>(null)

/** Puts its children in the column beside the room. Nothing, where none is open. */
export function Beside({ children }: { children: ReactNode }) {
  const slot = useContext(Slot)
  if (!slot) return null
  // What is beside the room cannot put something beside the room: a portal
  // keeps the React tree it was written in, so its contents get an empty slot.
  return createPortal(<Slot.Provider value={null}>{children}</Slot.Provider>, slot)
}

/**
 * A width the reader chose, remembered. Read after mount and not during render:
 * a prerendered page that read storage while rendering would disagree with its
 * own HTML.
 */
function useSpan(store: string, initial: number): [number, (n: number) => void] {
  const [span, setSpan] = useState(initial)
  useEffect(() => {
    try {
      const kept = Number(localStorage.getItem(store))
      if (kept >= FLOOR && kept <= CEIL) setSpan(kept)
    } catch {
      // No store is the default width, which is a state and not a failure.
    }
  }, [store])
  return [span, setSpan]
}

function keep(store: string, value: string): void {
  try {
    localStorage.setItem(store, value)
  } catch {
    // A browser that stores nothing still works; it just forgets.
  }
}

/**
 * A column's inner edge, which is also how wide it is. Pulled in past the floor
 * the column shuts, so the gesture that sizes it also puts it away. One control
 * for both edges: `side` says which of the column's edges is pinned.
 */
function Grip({
  side,
  store,
  span,
  onSpan,
  onShut,
  label,
}: {
  side: 'left' | 'right'
  store: string
  span: number
  onSpan: (n: number) => void
  onShut: () => void
  label: string
}) {
  const held = useRef(0)
  const wider = side === 'left' ? 'ArrowRight' : 'ArrowLeft'
  const pull = (x: number) => (side === 'left' ? x - held.current : held.current - x)
  return (
    <div
      role="separator"
      aria-orientation="vertical"
      aria-label={label}
      aria-valuenow={span}
      aria-valuemin={FLOOR}
      aria-valuemax={CEIL}
      tabIndex={0}
      data-frame-grip=""
      style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        [side === 'left' ? 'right' : 'left']: 0,
        width: 6,
        zIndex: 1,
        cursor: 'col-resize',
      }}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId)
        held.current = side === 'left' ? e.clientX - span : e.clientX + span
      }}
      onPointerMove={(e) => {
        if (!e.currentTarget.hasPointerCapture(e.pointerId)) return
        const want = pull(e.clientX)
        // A deliberate pull, not a twitch at the floor.
        if (want < FLOOR - 48) {
          e.currentTarget.releasePointerCapture(e.pointerId)
          onShut()
          return
        }
        onSpan(Math.min(CEIL, Math.max(FLOOR, want)))
      }}
      onPointerUp={() => keep(store, String(span))}
      onKeyDown={(e) => {
        if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
        e.preventDefault()
        const want = span + (e.key === wider ? 1 : -1) * (e.shiftKey ? 32 : 8)
        if (want < FLOOR) return onShut()
        const put = Math.min(CEIL, want)
        onSpan(put)
        keep(store, String(put))
      }}
    />
  )
}

/**
 * WHERE A SECTION MAY POINT: a path of this app, or an https address on another
 * host — nothing else. A protocol-relative `//host`, a `javascript:` or a bare
 * word would otherwise reach the host's router or an `<a>` as though it were a
 * place, and a router that prefixes addresses turns `@host` into somebody
 * else's site.
 */
const external = (href: string) => /^https:\/\//i.test(href)
const internal = (href: string) => /^\/(?![/\\])/.test(href)
const sound = (href: string) => external(href) || internal(href)

/**
 * A section, as the host's router moves to it — or as a plain link when it
 * lives on another host. A link opens in this tab and a middle click opens a
 * new one, which is what a reader expects of a place on another site.
 */
function Door({
  section,
  here,
  navigate,
  onPick,
  shape,
}: {
  section: Section
  here: boolean
  navigate?: (href: string) => void
  onPick?: () => void
  shape: 'row' | 'tile'
}) {
  const Icon = section.icon
  const mark = <Icon size={shape === 'row' ? 16 : 18} />
  const attrs = {
    'aria-label': section.label,
    'aria-current': here ? ('page' as const) : undefined,
    title: section.title ?? section.label,
    ...(shape === 'row' ? { 'data-frame-row': '' } : { 'data-frame-tile': '' }),
  }
  if (external(section.href))
    return (
      <a href={section.href} {...attrs}>
        {mark}
        <span>{section.label}</span>
      </a>
    )
  return (
    <button
      type="button"
      {...attrs}
      onClick={() => {
        navigate?.(section.href)
        onPick?.()
      }}
    >
      {mark}
      <span>{section.label}</span>
    </button>
  )
}

function Rail({
  sections,
  active,
  navigate,
  settings,
  more,
  strip,
  onPick,
}: Pick<
  FrameProps,
  'sections' | 'active' | 'navigate' | 'settings' | 'more' | 'strip'
> & {
  /** A phone's tab bar moves the reader while the sheet may be out: put it away. */
  onPick: () => void
}) {
  return (
    <nav data-slot="rail" aria-label="Places">
      {strip ? <div data-slot="strip">{strip}</div> : null}
      <div data-slot="places">
        {/* A phone shows four sections and this; a laptop never draws it. */}
        {more ? (
          <button
            type="button"
            data-slot="more"
            data-frame-tile=""
            aria-label="More places"
            title="More"
            onClick={more}
          >
            <MARKS.search size={18} />
            <span>More</span>
          </button>
        ) : null}
        {sections.map((section) => (
          <Door
            key={section.id}
            section={section}
            here={section.id === active}
            navigate={navigate}
            onPick={onPick}
            shape="tile"
          />
        ))}
      </div>
      {settings ? (
        <div data-slot="foot">
          <button
            type="button"
            data-frame-tile=""
            aria-label="Settings"
            title="Settings"
            onClick={settings}
          >
            <MARKS.gear size={18} />
            <span>Settings</span>
          </button>
        </div>
      ) : null}
    </nav>
  )
}

/** An icon control in the bar: a 44px target around a glyph. */
function Control({
  label,
  onPress,
  children,
  wide,
}: {
  label: string
  onPress: () => void
  children: ReactNode
  /** Only from 768px: a phone's own gestures do this, and the bar is narrow. */
  wide?: boolean
}) {
  return (
    <button
      type="button"
      data-frame-icon=""
      data-frame-md={wide ? '' : undefined}
      aria-label={label}
      title={label}
      onClick={onPress}
    >
      {children}
    </button>
  )
}

/** The search, as a field-shaped button: the palette is the host's. */
function Search({ find }: { find: Find }) {
  return (
    <button
      type="button"
      data-slot="find"
      onClick={find.open}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        width: '100%',
        height: 28,
        padding: '0 10px',
        border: `1px solid ${FRAME.edge}`,
        borderRadius: 8,
        background: 'transparent',
        color: FRAME.soft,
        font: 'inherit',
        fontSize: 12,
        cursor: 'pointer',
      }}
    >
      <MARKS.search size={13} />
      <span
        style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
      >
        Search {find.label}
      </span>
      <span
        aria-hidden="true"
        style={{
          marginLeft: 'auto',
          display: 'inline-flex',
          alignItems: 'center',
          height: 18,
          padding: '0 4px',
          borderRadius: 4,
          background: FRAME.edge,
          fontSize: 12,
          fontWeight: 600,
        }}
      >
        ⌘K
      </span>
    </button>
  )
}

export function Frame({
  sections,
  active,
  navigate,
  back,
  forward,
  home = '/',
  workspace,
  scope,
  find,
  actions,
  list,
  foot,
  account,
  settings,
  more,
  strip,
  side,
  panel,
  ready,
  className,
  children,
}: FrameProps) {
  useFrameStyles()
  // Open on the first render, which is what a prerendered page and a laptop
  // both expect; the reader's own choice arrives after mount, for the reason
  // `useSpan` reads there. A phone always starts shut: its sidebar is a sheet
  // over the room, and a sheet nobody asked for is in the way.
  const [open, setOpen] = useState(true)
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
    if (window.innerWidth < WIDE) return setOpen(false)
    let kept: string | null = null
    try {
      kept = localStorage.getItem(OPEN)
    } catch {
      // No store is open, which is a state and not a failure.
    }
    if (kept !== null) setOpen(kept === 'true')
  }, [])

  // AN EXPLICIT TOGGLE, KEPT PER DEVICE. No hover-to-open: a column that
  // appears under a passing pointer is a column nobody asked for. The phone's
  // sheet is not kept — it is a moment, not a preference.
  const toggle = useCallback(() => {
    setOpen((was) => {
      if (window.innerWidth >= WIDE) keep(OPEN, String(!was))
      return !was
    })
  }, [])
  const shut = useCallback(() => setOpen(false), [])
  const pick = useCallback(() => {
    if (window.innerWidth < ROOMY) setOpen(false)
  }, [])
  const state = useMemo(() => ({ open, toggle, pick }), [open, toggle, pick])

  const [span, setSpan] = useSpan(SPAN, 244)
  const [beside, setBeside] = useSpan(BESIDE, 380)
  // State and not a ref: a ref set during commit does not re-render, so the
  // portal would have nowhere to go on the pass that created its target.
  const [slot, setSlot] = useState<HTMLElement | null>(null)
  // A stable callback: a new ref function each render is detached and attached
  // again on every commit, and each pass would set the slot twice.
  const place = useCallback((el: HTMLDivElement | null) => setSlot(el), [])
  const sideOpen = Boolean(side?.open) && !panel
  useEffect(() => {
    if (!sideOpen) setSlot(null)
  }, [sideOpen])

  // ⌘K opens the search from anywhere in the frame.
  const finder = useRef(find)
  finder.current = find
  useEffect(() => {
    const chord = (e: KeyboardEvent) => {
      if (!finder.current) return
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        finder.current.open()
      }
    }
    window.addEventListener('keydown', chord)
    return () => window.removeEventListener('keydown', chord)
  }, [])

  const edge = `1px solid ${FRAME.edge}`
  const doors = sections.filter((section) => sound(section.href))
  const door = sound(home) ? home : '/'
  // THE SCOPE IS MOUNTED ONCE: in the bar where there is room for it, at the
  // top of the sheet on a phone. Drawn in both and hidden in one, it was two
  // selections and two sets of reads that could disagree. The first render is
  // the wide form, which is what a prerendered page and a laptop both expect.
  const narrow = useMediaQuery('(max-width: 767.98px)')

  return (
    <Frames.Provider value={state}>
      <div
        data-hanzo-frame=""
        data-slot="workspace"
        data-sidebar={open ? 'open' : 'shut'}
        data-strip={strip ? '' : undefined}
        data-hydrated={(ready ?? mounted) ? 'true' : undefined}
        className={className}
      >
        <Rail
          sections={doors}
          active={active}
          navigate={navigate}
          settings={settings}
          more={more}
          strip={strip}
          onPick={pick}
        />

        <header
          data-slot="bar"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            height: 44,
            padding: '0 12px',
            background: FRAME.ground,
            borderBottom: edge,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
            <Control label={open ? 'Close sidebar' : 'Open sidebar'} onPress={toggle}>
              <MARKS.sidebar size={16} />
            </Control>
            {back ? (
              <Control label="Back" onPress={back} wide>
                <MARKS.back size={16} />
              </Control>
            ) : null}
            {forward ? (
              <Control label="Forward" onPress={forward} wide>
                <MARKS.forward size={16} />
              </Control>
            ) : null}
            {scope && !narrow ? (
              <div
                data-slot="scope"
                data-frame-md=""
                style={{ display: 'flex', alignItems: 'center', minWidth: 0 }}
              >
                {scope}
              </div>
            ) : null}
          </div>
          <div
            style={{ display: 'flex', flex: 1, justifyContent: 'center', minWidth: 0 }}
          >
            {find ? (
              <div style={{ width: 440, maxWidth: '100%' }}>
                <Search find={find} />
              </div>
            ) : null}
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: 8,
              flexShrink: 0,
              minWidth: 0,
            }}
          >
            {actions}
            {side?.toggles ? (
              <div
                data-frame-lg=""
                style={{ display: 'flex', alignItems: 'center', gap: 4 }}
              >
                {side.toggles}
              </div>
            ) : null}
          </div>
        </header>

        {open ? (
          <button
            type="button"
            data-slot="scrim"
            aria-label="Close sidebar"
            onClick={shut}
          />
        ) : null}

        {open ? (
          <div data-slot="list">
            <div
              data-slot="sidebar"
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
                width: span,
                maxWidth: '100%',
                height: '100%',
                minHeight: 0,
                padding: 8,
                boxSizing: 'border-box',
                background: FRAME.ground,
                borderRight: edge,
              }}
            >
              <Grip
                side="left"
                store={SPAN}
                span={span}
                onSpan={setSpan}
                onShut={shut}
                label="Resize sidebar"
              />
              {/* THE WORKSPACE LEADS THE SIDEBAR: switching it changes everything
                  below, so it sits above everything below. The account at the
                  foot is the person, not the workspace. */}
              <div
                data-slot="workspace-switcher"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  minWidth: 0,
                  padding: '8px 8px 4px',
                }}
              >
                <a
                  href={door}
                  data-slot="home"
                  aria-label="Hanzo home"
                  title="Home"
                  onClick={(e) => {
                    if (
                      !navigate ||
                      e.metaKey ||
                      e.ctrlKey ||
                      e.shiftKey ||
                      e.button !== 0
                    )
                      return
                    e.preventDefault()
                    navigate(door)
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 28,
                    height: 28,
                    color: 'inherit',
                    flexShrink: 0,
                  }}
                >
                  <HanzoMark size={18} />
                </a>
                {workspace ? (
                  <div style={{ display: 'flex', minWidth: 0, flexShrink: 1 }}>
                    {workspace}
                  </div>
                ) : null}
              </div>
              {/* The scope's home on a phone, whose bar has no room for it. */}
              {scope && narrow ? (
                <div
                  data-slot="scope"
                  style={{ display: 'flex', minWidth: 0, padding: '0 8px 4px' }}
                >
                  {scope}
                </div>
              ) : null}
              <div
                data-slot="places-list"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0,
                  padding: '0 8px 8px',
                }}
              >
                {doors.map((section) => (
                  <Door
                    key={section.id}
                    section={section}
                    here={section.id === active}
                    navigate={navigate}
                    onPick={pick}
                    shape="row"
                  />
                ))}
                {settings ? (
                  <button
                    type="button"
                    data-frame-row=""
                    aria-label="Settings"
                    title="Settings"
                    onClick={settings}
                  >
                    <MARKS.gear size={16} />
                    <span>Settings</span>
                  </button>
                ) : null}
              </div>
              {list}
              {foot}
              {account}
            </div>
          </div>
        ) : null}

        <main
          data-slot="pane"
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            minWidth: 0,
            minHeight: 0,
            background: FRAME.ground,
            borderLeft: edge,
          }}
        >
          <Slot.Provider value={slot}>{children}</Slot.Provider>
        </main>

        {panel ? (
          <div data-slot="panel" style={{ display: 'flex', minHeight: 0 }}>
            {panel}
          </div>
        ) : sideOpen && side ? (
          <aside
            data-slot="side"
            style={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              width: beside,
              flexShrink: 0,
              minHeight: 0,
              background: FRAME.lifted,
              borderLeft: edge,
            }}
          >
            <Grip
              side="right"
              store={BESIDE}
              span={beside}
              onSpan={setBeside}
              onShut={side.close}
              label="Resize side panel"
            />
            {/* The column is the landmark; this is the box the room projects
                into, a container and not a second region. */}
            <div
              ref={place}
              style={{
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                minHeight: 0,
                overflow: 'auto',
              }}
            />
          </aside>
        ) : null}
      </div>
    </Frames.Provider>
  )
}
