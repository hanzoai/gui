'use client'

/**
 * ChatHero — the "What can I help with?" composer hero: a radial-gradient glow, a
 * big headline, the rounded ask-composer that forwards its value to a chat
 * target, and optional quick-action pills. Host owns submit + analytics.
 */

import { useState, useRef, type ReactNode, type ComponentType } from 'react'
import { ArrowUp } from '@hanzogui/lucide-icons-2'
import { styled, View } from '@hanzogui/web'
import { XStack, YStack } from '@hanzogui/stacks'
import { TextArea } from '@hanzogui/input'
import { Txt, useHover, useIsWide, useReveal } from './styles'
import { c, FONT, HERO_GLOW } from './tokens'

/** An icon component compatible with @hanzogui/lucide-icons-2 (size + color props). */
export type HeroIcon = ComponentType<{ size?: number; color?: string }>

export interface HeroPill {
  label: string
  icon: HeroIcon
  /** Submit the current composer value (carries the input into the chat target). */
  submit?: boolean
  /** Or link out to a surface. */
  href?: string
}

export interface ChatHeroProps {
  /**
   * Called with the trimmed composer value on submit. The host owns navigation +
   * analytics. If omitted, submit navigates to `href` with the value appended as `?q=`.
   */
  onSubmit?: (value: string) => void
  /** Fallback submit target when `onSubmit` is not provided. */
  href?: string
  /** Big headline. Defaults to "What can I help with?". */
  heading?: string
  /** Composer placeholder. Defaults to "Ask Hanzo anything". */
  placeholder?: string
  /** Quick-action pills under the composer (omit to hide). */
  pills?: HeroPill[]
  /** Called when a pill is pressed — host wires analytics. */
  onPill?: (pill: HeroPill) => void
  /** Small print under the pills. */
  footnote?: ReactNode
}

/* ── styled atoms ────────────────────────────────────────────────────────────── */

const Section = styled(YStack, {
  name: 'ChromeHero',
  render: 'section',
  position: 'relative',
  overflow: 'hidden',
  alignItems: 'center',
  justifyContent: 'center',
  paddingHorizontal: 24,
  paddingVertical: 64,
})

const Glow = styled(View, {
  name: 'ChromeHeroGlow',
  position: 'absolute',
  pointerEvents: 'none',
  width: 640,
  height: 640,
  borderRadius: 9999,
  opacity: 0.16,
})

const Composer = styled(XStack, {
  name: 'ChromeComposer',
  alignItems: 'flex-end',
  gap: 8,
  borderWidth: 1,
  borderRadius: 28,
  backgroundColor: c.field,
  padding: 10,
  paddingLeft: 20,
  shadowColor: '#000',
  shadowOpacity: 0.5,
  shadowRadius: 40,
  shadowOffset: { width: 0, height: 24 },
  variants: {
    focused: {
      true: { borderColor: c.fieldLineHover },
      false: { borderColor: c.fieldLine },
    },
  } as const,
  defaultVariants: { focused: false },
})

const Send = styled(View, {
  name: 'ChromeSend',
  render: 'button',
  cursor: 'pointer',
  width: 36,
  height: 36,
  flexShrink: 0,
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 9999,
  backgroundColor: c.ctaBg,
  hoverStyle: { opacity: 0.9 },
})

const PillFrame = styled(XStack, {
  name: 'ChromePill',
  render: 'button',
  cursor: 'pointer',
  alignItems: 'center',
  gap: 8,
  borderWidth: 1,
  borderColor: c.line,
  backgroundColor: c.fill,
  borderRadius: 9999,
  paddingHorizontal: 16,
  paddingVertical: 8,
  hoverStyle: { borderColor: c.fieldLine },
})

function Pill({ pill, onPress }: { pill: HeroPill; onPress: () => void }) {
  const { hovered, onHoverIn, onHoverOut } = useHover()
  const Icon = pill.icon
  return (
    <PillFrame onPress={onPress} onHoverIn={onHoverIn} onHoverOut={onHoverOut}>
      <Icon size={16} color={hovered ? c.fg : c.icon} />
      <Txt kind="nav" color={hovered ? c.fg : c.fgMuted}>
        {pill.label}
      </Txt>
    </PillFrame>
  )
}

/* ── component ───────────────────────────────────────────────────────────────── */

export function ChatHero({
  onSubmit,
  href,
  heading = 'What can I help with?',
  placeholder = 'Ask Hanzo anything',
  pills,
  onPill,
  footnote,
}: ChatHeroProps) {
  const [value, setValue] = useState('')
  const [focused, setFocused] = useState(false)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const wide = useIsWide(640)

  const revealH = useReveal({ y: 16 })
  const revealForm = useReveal({ y: 16, delay: 60 })
  const revealPills = useReveal({ y: 16, delay: 120 })
  const revealFoot = useReveal({ delay: 200 })

  const forward = (v: string) => {
    const q = v.trim()
    if (onSubmit) {
      onSubmit(q)
      return
    }
    if (href) {
      window.location.href = q ? `${href}${href.includes('?') ? '&' : '?'}q=${encodeURIComponent(q)}` : href
    }
  }

  const submit = () => forward(value)

  const handlePill = (pill: HeroPill) => {
    onPill?.(pill)
    if (pill.submit) return forward(value)
    if (pill.href) {
      window.location.href = pill.href
      return
    }
    inputRef.current?.focus()
  }

  return (
    <Section style={{ minHeight: 'calc(100svh - 64px)' }}>
      {/* Ambient glow */}
      <Glow
        style={{
          left: '50%',
          top: '38%',
          transform: 'translate(-50%,-50%)',
          background: HERO_GLOW,
          filter: 'blur(120px)',
        }}
      />

      <YStack width="100%" maxWidth={768} zIndex={10} alignItems="center">
        <Txt
          text="center"
          fontSize={wide ? 48 : 36}
          lineHeight={wide ? 52 : 40}
          fontWeight="600"
          letterSpacing={-1}
          color={c.fg}
          style={revealH}
        >
          {heading}
        </Txt>

        {/* Composer — Enter (no shift) and the send button both submit; no native
            <form> so the send button never triggers a page reload. */}
        <View width="100%" marginTop={32} style={revealForm}>
          <Composer focused={focused}>
            <TextArea
              id="ask"
              ref={inputRef as any}
              unstyled
              value={value}
              onChangeText={setValue}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              onKeyPress={(e: any) => {
                if (e?.nativeEvent?.key === 'Enter' && !e?.nativeEvent?.shiftKey) {
                  e.preventDefault?.()
                  submit()
                }
              }}
              placeholder={placeholder}
              placeholderTextColor={c.fgDim}
              aria-label={placeholder}
              flex={1}
              minHeight={28}
              maxHeight={160}
              paddingVertical={6}
              backgroundColor="transparent"
              borderWidth={0}
              color={c.fg}
              fontFamily={FONT}
              fontSize={15}
              style={{ resize: 'none', outline: 'none' }}
            />
            <Send onPress={submit} aria-label="Send">
              <ArrowUp size={20} color={c.ctaFg} />
            </Send>
          </Composer>
        </View>

        {/* Quick-action pills */}
        {pills && pills.length > 0 ? (
          <XStack marginTop={20} flexWrap="wrap" alignItems="center" justifyContent="center" gap={8} style={revealPills}>
            {pills.map((pill) => (
              <Pill key={pill.label} pill={pill} onPress={() => handlePill(pill)} />
            ))}
          </XStack>
        ) : null}

        {footnote ? (
          <Txt kind="dim" text="center" marginTop={24} style={revealFoot}>
            {footnote}
          </Txt>
        ) : null}
      </YStack>
    </Section>
  )
}
