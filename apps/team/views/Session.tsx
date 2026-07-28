import { Badge, Card, CardContent, CardHeader, CardTitle } from '@hanzo/ui'
import type { Props } from '~/src/views'

/** The React half of the parity pair. views/Facts.svelte renders the same facts. */
export function Session({ workspace, token }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Session</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-[8rem_1fr] gap-y-2 text-sm">
          <dt className="text-muted-foreground">Rendered by</dt>
          <dd data-facts="engine">
            <Badge>React</Badge>
          </dd>

          <dt className="text-muted-foreground">Workspace</dt>
          <dd data-facts="workspace">{workspace === '' ? '—' : workspace}</dd>

          <dt className="text-muted-foreground">Token</dt>
          <dd data-facts="token">{token === null ? 'absent' : 'present'}</dd>
        </dl>
      </CardContent>
    </Card>
  )
}
