<script lang="ts">
  /*
   * A Svelte view, mounted by the shell through components/Svelte.tsx.
   *
   * It is deliberately the same content as views/Session.tsx, rendered with
   * @hanzo/svelte instead of @hanzo/ui. Both read their tokens from src/theme.css,
   * so the two must look identical — and while ~2,400 Huly views are still Svelte,
   * that equivalence is what says a half-migrated shell looks whole.
   *
   * Note what this view CANNOT do: it has no handle on the sidebar, the router or
   * the workspace. It receives props and renders. That is the seam's whole point.
   */
  import Badge from '@hanzo/svelte/Badge.svelte'
  import Card from '@hanzo/svelte/Card.svelte'
  import CardContent from '@hanzo/svelte/CardContent.svelte'
  import CardHeader from '@hanzo/svelte/CardHeader.svelte'
  import CardTitle from '@hanzo/svelte/CardTitle.svelte'

  export let workspace: string
  export let token: string | null
</script>

<Card>
  <CardHeader>
    <CardTitle>Session</CardTitle>
  </CardHeader>
  <CardContent>
    <dl class="grid grid-cols-[8rem_1fr] gap-y-2 text-sm">
      <dt class="text-muted-foreground">Rendered by</dt>
      <dd data-facts="engine"><Badge>Svelte</Badge></dd>

      <dt class="text-muted-foreground">Workspace</dt>
      <dd data-facts="workspace">{workspace === '' ? '—' : workspace}</dd>

      <dt class="text-muted-foreground">Token</dt>
      <dd data-facts="token">{token === null ? 'absent' : 'present'}</dd>
    </dl>
  </CardContent>
</Card>
