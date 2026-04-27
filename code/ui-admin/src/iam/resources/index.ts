// IAM Resources Bucket — admin pages for the seven Casdoor resources
// that are not core identity (users / orgs / apps / providers / certs
// / tokens / sessions are buckets A–D). Exposes one List + Edit pair
// per resource; the Resource page is upload-only and has no edit
// surface, mirroring upstream.

export { ResourceList, type ResourceListProps } from './ResourceList'
export { FormList, type FormListProps } from './FormList'
export { FormEdit, type FormEditProps } from './FormEdit'
export { SiteList, type SiteListProps } from './SiteList'
export { SiteEdit, type SiteEditProps } from './SiteEdit'
export { ServerList, type ServerListProps } from './ServerList'
export { ServerEdit, type ServerEditProps } from './ServerEdit'
export { RecordList, type RecordListProps } from './RecordList'
export { TicketList, type TicketListProps } from './TicketList'
export { TicketEdit, type TicketEditProps } from './TicketEdit'
export { RuleList, type RuleListProps } from './RuleList'
export { RuleEdit, type RuleEditProps } from './RuleEdit'

export type {
  ResourceItem,
  FormDefinition,
  FormItem,
  FormType,
  SiteItem,
  ServerItem,
  ServerTool,
  RecordItem,
  TicketItem,
  TicketMessage,
  TicketState,
  RuleItem,
  RuleExpression,
  RuleType,
  RuleAction,
  AdminAccount,
  ListResponse,
  ItemResponse,
  ActionResponse,
} from './types'

export {
  ResourceUrls,
  FormUrls,
  SiteUrls,
  ServerUrls,
  RecordUrls,
  TicketUrls,
  RuleUrls,
} from './api'

export { isAdminAccount, requestOrg } from './types'
