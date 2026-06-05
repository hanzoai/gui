import { YStack } from 'hanzogui'

import * as AnAvatars from '@hanzogui/recipes/component/animation/avatars'
import {
  Showcase,
  ShowcaseChildWrapper as Wrapper,
} from '~/components/recipes-showcase/_Showcase'
import {
  type RecipesShowcaseContext,
  RecipesShowcaseProvider,
} from '~/components/recipes-showcase/RecipesProvider'

export function avatars({ isProUser, showAppropriateModal }: RecipesShowcaseContext) {
  return (
    <RecipesShowcaseProvider
      isProUser={isProUser}
      showAppropriateModal={showAppropriateModal}
    >
      <YStack pb="$10" gap="$12" p="$2" $gtLg={{ p: '$0' }}>
        <Showcase
          unlock
          fileName={AnAvatars.AvatarsTooltip.fileName}
          title="Hoverable Avatars"
        >
          <Wrapper>
            <AnAvatars.AvatarsTooltip />
          </Wrapper>
        </Showcase>
        <Showcase
          fileName={AnAvatars.AvatarsTooltipFancy.fileName}
          title="Fancy Hoverable Avatars"
        >
          <Wrapper>
            <AnAvatars.AvatarsTooltipFancy />
          </Wrapper>
        </Showcase>
      </YStack>
    </RecipesShowcaseProvider>
  )
}
