import { YStack } from 'hanzogui'

import * as Checkboxes from '@hanzogui/recipes/component/forms/checkboxes'
import {
  Showcase,
  ShowcaseChildWrapper as Wrapper,
} from '~/components/recipes-showcase/_Showcase'
import {
  type RecipesShowcaseContext,
  RecipesShowcaseProvider,
} from '~/components/recipes-showcase/RecipesProvider'

type Props = {
  codes: {
    CheckboxCards: string
    CheckboxList: string
    GroupedCheckbox: string
    HorizontalCheckboxes: string
    HorizontalWithDescriptionCheckboxes: string
    VerticalWithDescriptionCheckboxes: string
  }
} & RecipesShowcaseContext

export function checkboxes({ isProUser, showAppropriateModal }: Props) {
  return (
    <RecipesShowcaseProvider
      isProUser={isProUser}
      showAppropriateModal={showAppropriateModal}
    >
      <YStack pb="$10" gap="$12" p="$2" $gtLg={{ p: '$0' }}>
        <Showcase
          unlock
          fileName={Checkboxes.CheckboxCards.fileName}
          title="CheckBox Cards"
        >
          <Wrapper>
            <Checkboxes.CheckboxCards />
          </Wrapper>
        </Showcase>
        <Showcase fileName={Checkboxes.CheckboxList.fileName} title="Checkbox List">
          <Wrapper px={2}>
            <Checkboxes.CheckboxList />
          </Wrapper>
        </Showcase>
        <Showcase fileName={Checkboxes.GroupedCheckbox.fileName} title="Grouped Checkbox">
          <Wrapper px={2}>
            <Checkboxes.GroupedCheckbox />
          </Wrapper>
        </Showcase>
        <Showcase
          fileName={Checkboxes.HorizontalCheckboxes.fileName}
          title="Horizontal Checkboxes"
        >
          <Wrapper>
            <Checkboxes.HorizontalCheckboxes />
          </Wrapper>
        </Showcase>
        <Showcase
          fileName={Checkboxes.HorizontalWithDescriptionCheckboxes.fileName}
          title="Horizontal with Description Checkboxes"
        >
          <Wrapper>
            <Checkboxes.HorizontalWithDescriptionCheckboxes />
          </Wrapper>
        </Showcase>
        <Showcase
          fileName={Checkboxes.VerticalWithDescriptionCheckboxes.fileName}
          title="Vertical with Description Checkboxes"
        >
          <Wrapper>
            <Checkboxes.VerticalWithDescriptionCheckboxes />
          </Wrapper>
        </Showcase>
      </YStack>
    </RecipesShowcaseProvider>
  )
}

export function checkboxesGetComponentCodes() {
  return {
    codes: {
      CheckboxCards: '',
      CheckboxList: '',
      GroupedCheckbox: '',
      HorizontalCheckboxes: '',
      HorizontalWithDescriptionCheckboxes: '',
      VerticalCheckboxes: '',
      VerticalWithDescriptionCheckboxes: '',
    },
  }
}
