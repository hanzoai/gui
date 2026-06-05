import { YStack } from 'hanzogui'

import { Showcase } from '~/components/recipes-showcase/_Showcase'
import * as TabBars from '@hanzogui/recipes/component/shells/tabbars'
import {
  type RecipesShowcaseContext,
  RecipesShowcaseProvider,
} from '~/components/recipes-showcase/RecipesProvider'

type Props = ReturnType<typeof tabbarsGetComponentCodes> & RecipesShowcaseContext

export function tabbars({ isProUser, showAppropriateModal }: Props) {
  return (
    <RecipesShowcaseProvider
      isProUser={isProUser}
      showAppropriateModal={showAppropriateModal}
    >
      <YStack pb="$10" gap="$12" p="$2" $gtLg={{ p: '$0' }}>
        <Showcase
          unlock
          fileName={TabBars.Tabbar.fileName}
          title="React Navigation compatible Tabbar with Underline"
        >
          <TabBars.Tabbar />
        </Showcase>
        <Showcase
          fileName={TabBars.TabBarSecondExample.fileName}
          title="Progressive Tabbar with Underline Indicator"
        >
          <TabBars.TabBarSecondExample />
        </Showcase>
        <Showcase
          fileName={TabBars.TabbarSwippable.fileName}
          title="Swippable Tabbar Support Gesture Drag"
        >
          <TabBars.TabbarSwippable />
        </Showcase>
      </YStack>
    </RecipesShowcaseProvider>
  )
}

export function tabbarsGetComponentCodes() {
  return {
    codes: {
      Tabbar: '',
      TabBarSecondExample: '',
      TabbarSwippable: '',
    } as Omit<Record<keyof typeof TabBars, string>, 'getCode'>,
  }
}
