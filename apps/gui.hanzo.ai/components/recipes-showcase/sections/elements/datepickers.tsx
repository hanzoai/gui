import { YStack } from 'hanzogui'

import * as DatePickers from '@hanzogui/recipes/component/elements/datepickers'
import {
  Showcase,
  ShowcaseChildWrapper as Wrapper,
} from '~/components/recipes-showcase/_Showcase'
import {
  type RecipesShowcaseContext,
  RecipesShowcaseProvider,
} from '~/components/recipes-showcase/RecipesProvider'

export function datepickers({ isProUser, showAppropriateModal }: RecipesShowcaseContext) {
  return (
    <RecipesShowcaseProvider
      isProUser={isProUser}
      showAppropriateModal={showAppropriateModal}
    >
      <YStack pb="$10" gap="$12" p="$2" $gtLg={{ p: '$0' }}>
        <Showcase
          unlock
          fileName={DatePickers.DatePickerExample.fileName}
          title="DatePicker"
        >
          <Wrapper>
            <DatePickers.DatePickerExample />
          </Wrapper>
        </Showcase>

        <Showcase fileName={DatePickers.YearPickerInput.fileName} title="YearPicker">
          <Wrapper>
            <DatePickers.YearPickerInput />
          </Wrapper>
        </Showcase>

        <Showcase fileName={DatePickers.MonthPickerInput.fileName} title="MonthPicker">
          <Wrapper>
            <DatePickers.MonthPickerInput />
          </Wrapper>
        </Showcase>
        <Showcase
          fileName={DatePickers.MultiSelectPicker.fileName}
          title="MultiSelectPicker"
        >
          <Wrapper>
            <DatePickers.MultiSelectPicker />
          </Wrapper>
        </Showcase>
        <Showcase fileName={DatePickers.RangePicker.fileName} title="RangePicker">
          <Wrapper>
            <DatePickers.RangePicker />
          </Wrapper>
        </Showcase>
        <Showcase fileName={DatePickers.Calendar.fileName} title="Calendar">
          <Wrapper>
            <DatePickers.Calendar />
          </Wrapper>
        </Showcase>
      </YStack>
    </RecipesShowcaseProvider>
  )
}
