import { YStack } from 'hanzogui'

import { Showcase } from '~/components/recipes-showcase/_Showcase'
import * as Navbars from '@hanzogui/recipes/component/shells/navbars'
import {
  type RecipesShowcaseContext,
  RecipesShowcaseProvider,
} from '~/components/recipes-showcase/RecipesProvider'

type Props = ReturnType<typeof navbarsGetComponentCodes> & RecipesShowcaseContext

export function navbars({ isProUser, showAppropriateModal }: Props) {
  return (
    <RecipesShowcaseProvider
      isProUser={isProUser}
      showAppropriateModal={showAppropriateModal}
    >
      <YStack pb="$10" gap="$12" p="$2" $gtLg={{ p: '$0' }}>
        <Showcase
          fileName={Navbars.TopNavBarWithLogo.fileName}
          title="Top Navbar with Swippable Drawer on Smaller Screens"
        >
          <Navbars.TopNavBarWithLogo />
        </Showcase>
        <Showcase
          fileName={Navbars.TopNavBarWithUnderLineTabs.fileName}
          title="Top Navbar with Underline Tabs"
        >
          <Navbars.TopNavBarWithUnderLineTabs />
        </Showcase>

        <Showcase fileName={Navbars.FullSideBar.fileName} title="Responsive Sidebar">
          <Navbars.FullSideBar />
        </Showcase>
      </YStack>
    </RecipesShowcaseProvider>
  )
}

export function navbarsGetComponentCodes() {
  return {
    codes: {
      TopNavBarWithLogo: '',
      TopNavBarWithUnderLineTabs: '',
      FullSideBar: '',
    } as Omit<Record<keyof typeof Navbars, string>, 'getCode'>,
  }
}
