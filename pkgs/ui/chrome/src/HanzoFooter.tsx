'use client'

import type { ReactNode } from 'react'
import { Github } from 'lucide-react'
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

export function HanzoFooter({
  sections,
  logo,
  brand = 'Hanzo',
  tagline = 'The open-source cloud for AI agents.',
  homeHref = '/',
  legalName = 'Hanzo AI, Inc.',
  githubHref,
}: HanzoFooterProps) {
  return (
    <footer className="border-t border-neutral-900 px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <a href={homeHref} className="inline-flex items-center gap-2" aria-label={`${brand} home`}>
              {logo}
              <span className="text-[15px] font-semibold tracking-tight text-white">{brand}</span>
            </a>
            <p className="mt-3 max-w-[16rem] text-sm text-neutral-500">{tagline}</p>
          </div>

          {sections.map((col) => (
            <div key={col.title}>
              <div className="mb-3 text-xs font-medium uppercase tracking-wide text-neutral-500">
                {col.title}
              </div>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="text-sm text-neutral-400 transition-colors hover:text-white">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-neutral-900 pt-8 sm:flex-row">
          <p className="text-sm text-neutral-500">
            © {new Date().getFullYear()} {legalName} All rights reserved.
          </p>
          {githubHref && (
            <a
              href={githubHref}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={`${brand} on GitHub`}
              className="text-neutral-500 transition-colors hover:text-white"
            >
              <Github className="h-5 w-5" />
            </a>
          )}
        </div>
      </div>
    </footer>
  )
}
