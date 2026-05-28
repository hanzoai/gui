/**
 * `stripe` singleton — removed.
 *
 * Hanzo Commerce owns payment processor selection (Stripe is one of nine
 * configurable processors). gui.hanzo.ai never instantiates a Stripe client
 * directly any more — it calls `commerce.subscriptions.*` via the IAM-
 * authenticated REST surface in `~/features/commerce`.
 *
 * The previous Stripe SDK import (`import Stripe from 'stripe'`) is gone.
 * Re-exporting the type would re-introduce the runtime dependency, so we
 * deliberately surface a build error if any module still expects this file.
 *
 * TODO(supabase-rip): once every consumer imports from `~/features/commerce`,
 * delete this file outright.
 */

export const stripe = new Proxy(
  {},
  {
    get() {
      throw new Error(
        'features/stripe/stripe.ts: removed. Call commerce.subscriptions.* from ~/features/commerce.',
      )
    },
  },
) as never
