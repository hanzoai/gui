import { YStack } from 'hanzogui'

import * as Buttons from '@hanzogui/recipes/component/animation/buttons'
import {
  Showcase,
  ShowcaseChildWrapper as Wrapper,
} from '~/components/recipes-showcase/_Showcase'
import {
  type RecipesShowcaseContext,
  RecipesShowcaseProvider,
} from '~/components/recipes-showcase/RecipesProvider'

type Props = ReturnType<typeof buttonsGetComponentCodes> & RecipesShowcaseContext

export function buttons({ isProUser, showAppropriateModal }: Props) {
  return (
    <RecipesShowcaseProvider
      isProUser={isProUser}
      showAppropriateModal={showAppropriateModal}
    >
      <YStack pb="$10" gap="$12" p="$2" $gtLg={{ p: '$0' }}>
        <Showcase
          unlock
          fileName={Buttons.ButtonLoading.fileName}
          title="Loading Animation"
        >
          <Wrapper>
            <Buttons.ButtonLoading />
          </Wrapper>
        </Showcase>
        <Showcase fileName={Buttons.ButtonPulse.fileName} title="Press Animation">
          <Wrapper>
            <Buttons.ButtonPulse />
          </Wrapper>
        </Showcase>
        <Showcase fileName={Buttons.IconCenterButton.fileName} title="Icon Animation">
          <Wrapper>
            <Buttons.IconCenterButton />
          </Wrapper>
        </Showcase>
      </YStack>
    </RecipesShowcaseProvider>
  )
}

export function buttonsGetComponentCodes() {
  return {
    codes: {
      ButtonLoading: '',
      ButtonPulse: '',
      FillButton: '',
      IconCenterButton: '',
    } as Omit<Record<keyof typeof Buttons, string>, 'getCode'>,
  }
}
