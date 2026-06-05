/**
 * AddTeamMemberModal — REMOVED. Redirects to commerce checkout.
 *
 * The seat-management flow is owned by commerce. Opening this modal sends
 * the user to the commerce-hosted team management page.
 *
 * TODO(supabase-rip): a fully in-app seat picker can live here later;
 * for now we keep the call sites compiling with a redirect stub.
 */

import { useEffect } from 'react'
import { addTeamMemberModal, useAddTeamMemberModal } from './addTeamMemberModalStore'

const COMMERCE_TEAM_URL =
  process.env.NEXT_PUBLIC_HANZO_COMMERCE_TEAM_URL ??
  'https://commerce.hanzo.ai/team'

export const AddTeamMemberModal = () => {
  const { show } = useAddTeamMemberModal()

  useEffect(() => {
    if (!show || typeof window === 'undefined') return
    const returnTo = encodeURIComponent(window.location.href)
    window.location.href = `${COMMERCE_TEAM_URL}?return_to=${returnTo}`
    addTeamMemberModal.show = false
  }, [show])

  return null
}

export default AddTeamMemberModal
