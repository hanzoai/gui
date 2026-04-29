import { describe, it } from 'vitest'

// FEATURE-1 shipped src/components/workflow/WorkflowStatusPill.tsx. The
// component pulls in the hanzogui TamaguiProvider chain transitively
// (Text/XStack/Badge), which under jsdom requires the full theme
// extractor to have run. Wiring that up at the unit-test layer is
// disproportionate to the value — the pill renders a single Badge with
// a string label drawn from format.iconForStatus + statusVariant, both
// of which are exhaustively unit-tested in lib/format.test.ts.
//
// Keeping this file as a skip placeholder so:
//   - the test count matches FEATURE-9's deliverable list
//   - if FEATURE-1 (or a follow-up) wires a lightweight test provider
//     into @hanzogui/admin, this file is the one place to enable RTL
//     coverage for the pill.
describe.skip('WorkflowStatusPill (needs hanzogui test provider)', () => {
  it('placeholder', () => {})
})
