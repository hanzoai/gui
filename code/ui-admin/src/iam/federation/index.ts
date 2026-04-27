// IAM federation bucket — LDAP, Syncers, Webhooks, Invitations, Verifications.
//
// One barrel for every route in this surface. Pages are
// router-agnostic: they take `onExit` / `onOpen…` callbacks so the
// hosting app (admin-iam, admin-tasks, …) decides how routes work.

export { LdapEdit, type LdapEditProps, SelectInline } from './LdapEdit'
export { LdapSync, type LdapSyncProps } from './LdapSync'
export { SyncerList, type SyncerListProps } from './SyncerList'
export { SyncerEdit, type SyncerEditProps } from './SyncerEdit'
export { WebhookList, type WebhookListProps } from './WebhookList'
export { WebhookEdit, type WebhookEditProps } from './WebhookEdit'
export { InvitationList, type InvitationListProps } from './InvitationList'
export { InvitationEdit, type InvitationEditProps, isLikelyEmail } from './InvitationEdit'
export { VerificationList, type VerificationListProps } from './VerificationList'

export type {
  Ldap,
  LdapAttribute,
  LdapUserPreview,
  LdapSyncResult,
  LdapSyncEvent,
  Syncer,
  SyncerType,
  SyncerColumn,
  Webhook,
  WebhookHeader,
  Invitation,
  Verification,
  IamListResponse,
  IamItemResponse,
} from './types'
