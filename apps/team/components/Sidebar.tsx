import { Button, ScrollArea, Separator } from '@hanzo/ui'
import type { Brand } from '~/src/brand'
import type { View } from '~/src/views'
import { Mark } from './Mark'

/*
 * The navigator. It owns which view is active — a view never moves itself.
 *
 * Composed from `@hanzo/ui` primitives rather than imported whole, because the
 * Sidebar family is not consumable: `@hanzo/ui@8.0.26`'s barrel exports 86 names
 * and none of them are Sidebar*, and `@hanzo/ui-shadcn@5.9.1` carries the 726-line
 * source but ships no `dist/primitives/sidebar`, so the 23 Sidebar exports resolve
 * from neither package. Publishing it collapses this file to an import.
 */
export function Sidebar({
  brand,
  views,
  active,
  onSelect,
}: {
  brand: Brand | undefined
  views: readonly View[]
  active: string
  onSelect: (id: string) => void
}) {
  return (
    <nav
      aria-label="Views"
      className="flex h-full w-60 shrink-0 flex-col border-r border-border bg-card"
    >
      <div className="flex h-14 items-center gap-2 px-4">
        <Mark brand={brand} />
      </div>

      <Separator />

      <ScrollArea className="flex-1">
        <ul className="flex flex-col gap-0.5 p-2">
          {views.map((view) => (
            <li key={view.id}>
              <Button
                variant={view.id === active ? 'secondary' : 'ghost'}
                aria-current={view.id === active ? 'page' : undefined}
                data-view={view.id}
                className="w-full justify-start font-normal"
                onClick={() => onSelect(view.id)}
              >
                {view.label}
              </Button>
            </li>
          ))}
        </ul>
      </ScrollArea>
    </nav>
  )
}
