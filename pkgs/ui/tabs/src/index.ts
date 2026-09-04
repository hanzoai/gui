import { createTabs } from './createTabs.tsx'
import { DefaultTabsContentFrame, DefaultTabsFrame, DefaultTabsTabFrame } from './Tabs.tsx'
export * from './createTabs.tsx'
export * from './StyledContext.tsx'

export const Tabs = createTabs({
  ContentFrame: DefaultTabsContentFrame,
  TabFrame: DefaultTabsTabFrame,
  TabsFrame: DefaultTabsFrame,
})
