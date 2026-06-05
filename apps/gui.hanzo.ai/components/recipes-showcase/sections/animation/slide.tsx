import { YStack } from 'hanzogui'

import * as Slide from '@hanzogui/recipes/component/animation/slide'
import {
  Showcase,
  ShowcaseChildWrapper as Wrapper,
} from '~/components/recipes-showcase/_Showcase'
import {
  type RecipesShowcaseContext,
  RecipesShowcaseProvider,
} from '~/components/recipes-showcase/RecipesProvider'

export function slide({ isProUser, showAppropriateModal }: RecipesShowcaseContext) {
  return (
    <RecipesShowcaseProvider
      isProUser={isProUser}
      showAppropriateModal={showAppropriateModal}
    >
      <YStack pb="$10" gap="$12" p="$2" $gtLg={{ p: '$0' }}>
        <Showcase unlock fileName={Slide.SlideInDemo.fileName} title="Slide In">
          <Wrapper>
            <Slide.SlideInDemo />
          </Wrapper>
        </Showcase>
        <Showcase fileName={Slide.SlideOutDemo.fileName} title="Slide Out">
          <Wrapper>
            <Slide.SlideOutDemo />
          </Wrapper>
        </Showcase>
      </YStack>
    </RecipesShowcaseProvider>
  )
}

export function slideGetComponentCodes() {
  return {
    codes: {
      SlideInDemo: '',
      SlideOutDemo: '',
    } as Omit<Record<keyof typeof Slide, string>, 'getCode'>,
  }
}
