'use client'

/**
 * Scope — the project and the environment, together in the bar as ONE visible
 * resource scope. The workspace is not here: it is the switcher at the top of
 * the sidebar, and it changes everything beneath it, this included.
 *
 * The selection belongs to the WORKSPACE it was made in. `useScope(org)` keeps
 * the last project per workspace and the last environment per project, and on a
 * workspace switch restores that workspace's own last project — or falls back,
 * visibly, to "All projects". A project from another workspace is never carried
 * across: its key is the other workspace's.
 *
 * An environment list the platform has not given is not invented: with none,
 * no environment control is drawn.
 *
 * THE KEYS ARE PER WORKSPACE, NOT PER PERSON. Two people who share a browser
 * and a workspace would share the last project, so the host clears
 * `hanzo:scope:*` when the person changes — hanzo.ai and the Hanzo App do, with
 * every other `hanzo*` key, in `own()`. A host without that sweep must add it.
 */
import React, { useCallback, useEffect, useState } from 'react'
import { FRAME, FS } from './theme.ts'

export interface ScopeProject {
  /** What the selection stores and `onProject` hands back. */
  id: string
  name: string
}

export interface ScopeProps {
  /** The workspace's projects; null while they are being read. */
  projects: ScopeProject[] | null
  /** The chosen project's id; null is All projects. */
  project: string | null
  onProject: (id: string | null) => void
  /** The workspace's environments, as the platform names them. */
  environments?: string[]
  environment?: string | null
  onEnvironment?: (name: string) => void
}

const PREFIX = 'hanzo:scope:'

function read(key: string): string | null {
  try {
    return localStorage.getItem(PREFIX + key)
  } catch {
    return null
  }
}

function write(key: string, value: string | null): void {
  try {
    if (value) localStorage.setItem(PREFIX + key, value)
    else localStorage.removeItem(PREFIX + key)
  } catch {
    // A browser that stores nothing still scopes; it forgets on reload.
  }
}

/**
 * The scope for one workspace, kept per workspace.
 *
 * Read after mount, like every stored choice a prerendered page makes, and
 * again whenever the workspace changes — which is the restore: the new
 * workspace's own last project, or none.
 */
export function useScope(org: string | null): {
  project: string | null
  setProject: (id: string | null) => void
  environment: string | null
  setEnvironment: (name: string | null) => void
} {
  const [project, choose] = useState<string | null>(null)
  const [environment, place] = useState<string | null>(null)
  useEffect(() => {
    const kept = org ? read(`${org}:project`) : null
    choose(kept)
    place(org ? read(`${org}:${kept ?? '*'}:environment`) : null)
  }, [org])
  const setProject = useCallback(
    (id: string | null) => {
      choose(id)
      if (!org) return
      write(`${org}:project`, id)
      place(read(`${org}:${id ?? '*'}:environment`))
    },
    [org]
  )
  const setEnvironment = useCallback(
    (name: string | null) => {
      place(name)
      if (org) write(`${org}:${project ?? '*'}:environment`, name)
    },
    [org, project]
  )
  return { project, setProject, environment, setEnvironment }
}

const SELECT: React.CSSProperties = {
  height: 28,
  maxWidth: 180,
  padding: '0 6px',
  border: `1px solid ${FRAME.edge}`,
  borderRadius: 8,
  background: 'transparent',
  color: FRAME.ink,
  font: 'inherit',
  fontSize: FS.sm,
  cursor: 'pointer',
  textOverflow: 'ellipsis',
}

export function Scope({
  projects,
  project,
  onProject,
  environments = [],
  environment,
  onEnvironment,
}: ScopeProps) {
  // A kept project the workspace no longer has is not the scope. Shown as All
  // projects until the list says otherwise, rather than as a name nobody can see.
  const known = project !== null && (projects ?? []).some((p) => p.id === project)
  return (
    <div
      role="group"
      aria-label="Scope"
      style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}
    >
      <select
        aria-label="Project"
        value={known ? (project as string) : ''}
        onChange={(e) => onProject(e.target.value || null)}
        disabled={projects === null}
        style={SELECT}
      >
        <option value="">
          {projects === null ? 'Reading projects' : 'All projects'}
        </option>
        {(projects ?? []).map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>
      {environments.length > 0 && onEnvironment ? (
        <select
          aria-label="Environment"
          value={
            environment && environments.includes(environment)
              ? environment
              : environments[0]
          }
          onChange={(e) => onEnvironment(e.target.value)}
          style={SELECT}
        >
          {environments.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      ) : null}
    </div>
  )
}
