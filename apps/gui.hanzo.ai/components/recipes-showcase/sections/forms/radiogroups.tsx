import { YStack } from 'hanzogui'

import * as RadioGroups from '@hanzogui/recipes/component/forms/radiogroups'
import {
  Showcase,
  ShowcaseChildWrapper as Wrapper,
} from '~/components/recipes-showcase/_Showcase'
import {
  type RecipesShowcaseContext,
  RecipesShowcaseProvider,
} from '~/components/recipes-showcase/RecipesProvider'

type Props = ReturnType<typeof radiogroupsGetComponentCodes> & RecipesShowcaseContext

export function radiogroups({ isProUser, showAppropriateModal }: Props) {
  return (
    <RecipesShowcaseProvider
      isProUser={isProUser}
      showAppropriateModal={showAppropriateModal}
    >
      <YStack pb="$10" gap="$12" p="$2" $gtLg={{ p: '$0' }}>
        <Showcase
          unlock
          fileName={RadioGroups.GroupedRadio.fileName}
          title="RadioGroup List"
        >
          <Wrapper p={2}>
            <RadioGroups.GroupedRadio />
          </Wrapper>
        </Showcase>
        <Showcase
          fileName={RadioGroups.Horizontal.fileName}
          title="Horizontal RadioGroups"
        >
          <Wrapper>
            <RadioGroups.Horizontal />
          </Wrapper>
        </Showcase>
        <Showcase
          fileName={RadioGroups.HorizontalWithDescription.fileName}
          title="Horizontal RadioGroups with description"
        >
          <Wrapper>
            <RadioGroups.HorizontalWithDescription />
          </Wrapper>
        </Showcase>
        <Showcase fileName={RadioGroups.RadioCards.fileName} title="Cards RadioGroups">
          <Wrapper>
            <RadioGroups.RadioCards />
          </Wrapper>
        </Showcase>
        <Showcase fileName={RadioGroups.RadioList.fileName} title="List RadioGroups">
          <Wrapper p={2}>
            <RadioGroups.RadioList />
          </Wrapper>
        </Showcase>
        <Showcase fileName={RadioGroups.Vertical.fileName} title="Vertical RadioGroups">
          <Wrapper>
            <RadioGroups.Vertical />
          </Wrapper>
        </Showcase>
        <Showcase
          fileName={RadioGroups.VerticalWithDescription.fileName}
          title="Vertical with Description RadioGroups"
        >
          <Wrapper>
            <RadioGroups.VerticalWithDescription />
          </Wrapper>
        </Showcase>
      </YStack>
    </RecipesShowcaseProvider>
  )
}

export function radiogroupsGetComponentCodes() {
  return {
    codes: {
      GroupedRadio: '',
      Horizontal: '',
      HorizontalWithDescription: '',
      RadioCards: '',
      RadioList: '',
      Vertical: '',
      VerticalWithDescription: '',
    } as Omit<Record<keyof typeof RadioGroups, string>, 'getCode'>,
  }
}
