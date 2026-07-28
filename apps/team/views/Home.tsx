import { Card, CardContent, CardHeader, CardTitle } from '@hanzo/ui'
import { VIEWS, type Props } from '~/src/views'

/** Landing view: what this workspace holds, and how much of it is ported. */
export function Home({ workspace }: Props) {
  const svelte = VIEWS.filter((v) => 'svelte' in v.content).length

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>{workspace === '' ? 'No workspace open' : workspace}</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground text-sm">
          Pick a view on the left, or press <kbd className="text-foreground">⌘K</kbd>.
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Views</CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          <p data-home="counts">
            {VIEWS.length} registered, {VIEWS.length - svelte} React, {svelte} Svelte.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
