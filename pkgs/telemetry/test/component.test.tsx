// @vitest-environment happy-dom
//
// A click is named by the component that drew it, using the annotations the
// compiler already writes. Nothing here is hand-annotated: the fixtures carry
// the same `data-is` / `data-in` / `data-at` the compiler emits.

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { useComponentTracking } from '../src/useComponentTracking.ts'
import type { Telemetry } from '../src/types.ts'

let container: HTMLDivElement
let root: Root
let track: ReturnType<typeof vi.fn>
let telemetry: Telemetry

const Probe = ({ enabled = true }: { enabled?: boolean }) => {
  useComponentTracking(telemetry, enabled)
  return null
}

const mount = (enabled = true) =>
  act(() => {
    root.render(<Probe enabled={enabled} />)
  })

const click = (el: Element) =>
  act(() => {
    el.dispatchEvent(new window.MouseEvent('click', { bubbles: true }))
  })

const event = () => track.mock.calls.at(-1)?.[1] as Record<string, unknown>

beforeEach(() => {
  container = document.createElement('div')
  document.body.appendChild(container)
  root = createRoot(container)
  track = vi.fn()
  telemetry = { track } as unknown as Telemetry
})

afterEach(() => {
  act(() => root.unmount())
  container.remove()
  document.body.innerHTML = ''
})

describe('useComponentTracking', () => {
  it('names the component, its caller and the call site', () => {
    mount()
    document.body.insertAdjacentHTML(
      'beforeend',
      `<button data-is="Button" data-in="PricingCard" data-at="pricing.tsx:42">
         <span>Buy</span>
       </button>`,
    )
    click(document.querySelector('span')!)

    expect(track).toHaveBeenCalledWith('component_clicked', expect.anything())
    expect(event()).toMatchObject({
      component: 'Button',
      used_in: 'PricingCard',
      at: 'pricing.tsx:42',
      label: 'Buy',
    })
  })

  it('reads the nearest annotated ancestor, not the leaf under the pointer', () => {
    mount()
    document.body.insertAdjacentHTML(
      'beforeend',
      `<div data-is="Card" data-at="a.tsx:1"><i id="leaf">x</i></div>`,
    )
    click(document.getElementById('leaf')!)

    expect(event()).toMatchObject({ component: 'Card', at: 'a.tsx:1' })
  })

  it('prefers the accessible name over the text', () => {
    mount()
    document.body.insertAdjacentHTML(
      'beforeend',
      `<button aria-label="Close dialog" data-is="IconButton" data-at="b.tsx:2">x</button>`,
    )
    click(document.querySelector('button')!)

    expect(event()).toMatchObject({ label: 'Close dialog' })
  })

  it('caps the label so a click cannot post a paragraph', () => {
    mount()
    document.body.insertAdjacentHTML(
      'beforeend',
      `<button data-is="B" data-at="c.tsx:3">${'x'.repeat(500)}</button>`,
    )
    click(document.querySelector('button')!)

    expect((event().label as string).length).toBe(80)
  })

  it('says nothing about bare page furniture', () => {
    mount()
    document.body.insertAdjacentHTML('beforeend', '<div id="bare"></div>')
    click(document.getElementById('bare')!)

    expect(track).not.toHaveBeenCalled()
  })

  it('survives a handler that stops propagation', () => {
    mount()
    document.body.insertAdjacentHTML(
      'beforeend',
      `<div data-is="Menu" data-at="d.tsx:4"><button id="item">Open</button></div>`,
    )
    document
      .getElementById('item')!
      .addEventListener('click', (e) => e.stopPropagation())
    click(document.getElementById('item')!)

    expect(event()).toMatchObject({ component: 'Menu', label: 'Open' })
  })

  it('listens only while enabled', () => {
    mount(false)
    document.body.insertAdjacentHTML(
      'beforeend',
      `<button data-is="B" data-at="e.tsx:5">Go</button>`,
    )
    click(document.querySelector('button')!)

    expect(track).not.toHaveBeenCalled()
  })

  it('stops listening once unmounted', () => {
    mount()
    document.body.insertAdjacentHTML(
      'beforeend',
      `<button data-is="B" data-at="f.tsx:6">Go</button>`,
    )
    act(() => root.unmount())
    root = createRoot(container)
    click(document.querySelector('button')!)

    expect(track).not.toHaveBeenCalled()
  })
})
