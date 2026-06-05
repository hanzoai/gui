/**
 * V2 Pro purchase — REMOVED. Use commerce + @hanzoai/pay.
 *
 * The old route did the full Stripe orchestration in-process:
 *   - charge $250 one-time license
 *   - schedule $100/yr upgrade subscription starting in 12 months
 *   - optional support-tier subscription (direct / sponsor)
 *   - parity discount via CF-IPCountry
 *   - 3DS handshake + rollback on partial failure
 *
 * All of that now lives in hanzoai/commerce, which serves the checkout UI
 * via the embedded @hanzoai/pay SPA. The client should redirect to:
 *
 *   GET https://commerce.hanzo.ai/checkout?
 *       sku=gui_pro_v2&support=<tier>&parity=auto&return_to=<finished_url>
 *
 * Commerce handles processor selection, 3DS, parity, and emits the project
 * creation event back to gui via a webhook (commerce -> gui /api/v1/projects).
 *
 * TODO(supabase-rip): wire the redirect-to-pay flow into the V2 modal +
 * payment-finished page once commerce ships the SKU registration we need.
 */

import { apiRoute } from '~/features/api/apiRoute'

export default apiRoute(async () => {
  return Response.json(
    {
      error: 'V2 purchase moved to commerce.hanzo.ai/checkout',
      docs: 'https://docs.hanzo.ai/commerce/checkout',
    },
    { status: 501 },
  )
})
