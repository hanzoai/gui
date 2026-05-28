/**
 * StripePaymentModal — REMOVED. Redirects to commerce checkout.
 *
 * The original 1400-line in-app Stripe Elements flow has been replaced by
 * the embedded `@hanzoai/pay` SPA hosted at commerce.hanzo.ai. Opening this
 * modal now performs a top-level redirect to commerce with the relevant
 * SKU + return URL.
 *
 * TODO(supabase-rip): replace the redirect with a iframe + postMessage
 * wrapper if we want true in-page checkout. For now the redirect keeps
 * the gui-side call sites compiling without any Stripe SDK in the bundle.
 */

import { useEffect } from 'react'
import { paymentModal, usePaymentModal } from './paymentModalStore'

const COMMERCE_CHECKOUT =
  process.env.NEXT_PUBLIC_HANZO_COMMERCE_CHECKOUT_URL ??
  'https://commerce.hanzo.ai/checkout'

export type StripePaymentModalProps = {
  showAccountModal?: boolean
  productName?: string
}

export const StripePaymentModal = (_props: StripePaymentModalProps) => {
  const { show } = usePaymentModal()

  useEffect(() => {
    if (!show || typeof window === 'undefined') return
    const sku = _props.productName ?? 'gui_pro'
    const returnTo = encodeURIComponent(
      `${window.location.origin}/payment-finished`,
    )
    window.location.href = `${COMMERCE_CHECKOUT}?sku=${encodeURIComponent(sku)}&return_to=${returnTo}`
    paymentModal.show = false
  }, [show, _props.productName])

  return null
}

export default StripePaymentModal
