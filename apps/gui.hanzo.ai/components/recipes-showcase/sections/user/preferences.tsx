import { YStack } from 'hanzogui'

import * as Preferences from '@hanzogui/recipes/component/user/preferences'
import {
  Showcase,
  ShowcaseChildWrapper as Wrapper,
} from '~/components/recipes-showcase/_Showcase'
import { RecipesShowcaseProvider } from '~/components/recipes-showcase/RecipesProvider'

type Props = ReturnType<typeof preferencesGetComponentCodes> & {
  isProUser: boolean
  showAppropriateModal: () => void
}

export function preferences({ isProUser, showAppropriateModal }: Props) {
  return (
    <RecipesShowcaseProvider
      isProUser={isProUser}
      showAppropriateModal={showAppropriateModal}
    >
      <YStack pb="$10" gap="$12" p="$2" $gtLg={{ p: '$0' }}>
        <Showcase
          unlock={true}
          fileName={Preferences.Meeting.fileName}
          title="Meeting Time"
        >
          <Wrapper p={0}>
            <Preferences.Meeting />
          </Wrapper>
        </Showcase>

        <Showcase
          fileName={Preferences.LocationNotification.fileName}
          title="Email Preferences"
        >
          <Wrapper p={0}>
            <Preferences.LocationNotification />
          </Wrapper>
        </Showcase>

        <Showcase
          fileName={Preferences.StatusTracker.fileName}
          title="Employees Status Tracker"
        >
          <Wrapper p={0}>
            <Preferences.StatusTracker />
          </Wrapper>
        </Showcase>
      </YStack>
    </RecipesShowcaseProvider>
  )
}

export function preferencesGetComponentCodes() {
  return {
    codes: {
      LocationNotification: '',
      Meeting: '',
      StatusTracker: '',
    } as Omit<Record<keyof typeof Preferences, string>, 'getCode'>,
  }
}
