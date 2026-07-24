'use client'

import { useState, useRef, type FormEvent, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { ArrowUp, type LucideIcon } from 'lucide-react'

export interface HeroPill {
  label: string
  icon: LucideIcon
  /** Submit the current composer value (carries the input into the chat target). */
  submit?: boolean
  /** Or link out to a surface. */
  href?: string
}

export interface ChatHeroProps {
  /**
   * Called with the trimmed composer value on submit. The host owns navigation +
   * analytics (e.g. forward to hanzo.chat, or drop into the local chat app). If
   * omitted, submit navigates to `href` with the value appended as `?q=`.
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
  const inputRef = useRef<HTMLTextAreaElement>(null)

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

  const submit = (e: FormEvent) => {
    e.preventDefault()
    forward(value)
  }

  const handlePill = (pill: HeroPill) => {
    onPill?.(pill)
    if (pill.submit) {
      forward(value)
      return
    }
    if (pill.href) {
      window.location.href = pill.href
      return
    }
    inputRef.current?.focus()
  }

  return (
    <section className="relative flex min-h-[calc(100svh-4rem)] flex-col items-center justify-center overflow-hidden px-4 py-16 sm:px-6 lg:px-8">
      {/* Ambient glow (matches the site's radial-gradient hero). */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div
          className="absolute left-1/2 top-[38%] h-[640px] w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.16]"
          style={{ background: 'radial-gradient(circle, #ffffff 0%, transparent 70%)', filter: 'blur(120px)' }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center text-4xl font-semibold tracking-tight text-white sm:text-5xl"
        >
          {heading}
        </motion.h1>

        {/* Composer */}
        <motion.form
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.06 }}
          onSubmit={submit}
          className="mx-auto mt-8 w-full"
        >
          <div className="flex items-end gap-2 rounded-[28px] border border-neutral-700 bg-neutral-900/70 p-2.5 pl-5 shadow-2xl transition-colors focus-within:border-neutral-500">
            <textarea
              id="ask"
              ref={inputRef}
              rows={1}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) submit(e)
              }}
              placeholder={placeholder}
              aria-label={placeholder}
              className="max-h-40 min-h-[28px] flex-1 resize-none bg-transparent py-1.5 text-[15px] text-white placeholder-neutral-500 outline-none"
            />
            <button
              type="submit"
              aria-label="Send"
              className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-white text-black transition-opacity hover:opacity-90"
            >
              <ArrowUp className="h-5 w-5" />
            </button>
          </div>
        </motion.form>

        {/* Quick-action pills */}
        {pills && pills.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.12 }}
            className="mt-5 flex flex-wrap items-center justify-center gap-2"
          >
            {pills.map((pill) => {
              const Icon = pill.icon
              return (
                <button
                  key={pill.label}
                  onClick={() => handlePill(pill)}
                  className="inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900/50 px-4 py-2 text-sm text-neutral-300 transition-colors hover:border-neutral-700 hover:text-white"
                >
                  <Icon className="h-4 w-4 text-neutral-400" />
                  {pill.label}
                </button>
              )
            })}
          </motion.div>
        )}

        {footnote && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mt-6 text-center text-sm text-neutral-500"
          >
            {footnote}
          </motion.p>
        )}
      </div>
    </section>
  )
}
