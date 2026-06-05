import { YStack } from 'hanzogui'

import * as Chips from '@hanzogui/recipes/component/elements/chips'
import {
  Showcase,
  WithSize,
  ShowcaseChildWrapper as Wrapper,
} from '~/components/recipes-showcase/_Showcase'
import {
  type RecipesShowcaseContext,
  RecipesShowcaseProvider,
} from '~/components/recipes-showcase/RecipesProvider'

export function chips({ isProUser, showAppropriateModal }: RecipesShowcaseContext) {
  return (
    <RecipesShowcaseProvider
      isProUser={isProUser}
      showAppropriateModal={showAppropriateModal}
    >
      <YStack pb="$10" gap="$12" p="$2" $gtLg={{ p: '$0' }}>
        <Showcase unlock fileName={Chips.Chips.fileName} title="Simple Chips">
          <Wrapper>
            <WithSize>
              <Chips.Chips />
            </WithSize>
          </Wrapper>
        </Showcase>
        <Showcase
          fileName={Chips.ChipsNoTextColor.fileName}
          title="Chips White Text and Pressable"
        >
          <Wrapper>
            <WithSize>
              <Chips.ChipsNoTextColor />
            </WithSize>
          </Wrapper>
        </Showcase>
        <Showcase fileName={Chips.ChipsRounded.fileName} title="Rounded Chips">
          <Wrapper>
            <WithSize>
              <Chips.ChipsRounded />
            </WithSize>
          </Wrapper>
        </Showcase>
        <Showcase
          fileName={Chips.ChipsWithCloseIcon.fileName}
          title="Chips with Close Icon"
        >
          <Wrapper>
            <WithSize>
              <Chips.ChipsWithCloseIcon />
            </WithSize>
          </Wrapper>
        </Showcase>
        <Showcase fileName={Chips.ChipsWithIcon.fileName} title="Chips with Icon">
          <Wrapper>
            <WithSize>
              <Chips.ChipsWithIcon />
            </WithSize>
          </Wrapper>
        </Showcase>
      </YStack>
    </RecipesShowcaseProvider>
  )
}
