import { YStack } from 'hanzogui'

import * as Dialogs from '@hanzogui/recipes/component/elements/dialogs'
import {
  Showcase,
  ShowcaseChildWrapper as Wrapper,
} from '~/components/recipes-showcase/_Showcase'
import { RecipesShowcaseProvider } from '~/components/recipes-showcase/RecipesProvider'

export function dialogs({
  showAppropriateModal,
  isProUser,
}: {
  showAppropriateModal: () => void
  isProUser: boolean
}) {
  return (
    <RecipesShowcaseProvider
      showAppropriateModal={showAppropriateModal}
      isProUser={isProUser}
    >
      <YStack pb="$10" gap="$12" p="$2" $gtLg={{ p: '$0' }}>
        <Showcase
          unlock={true}
          fileName={Dialogs.SlidingPopoverDemo.fileName}
          title="Sliding Popover"
        >
          <Wrapper>
            <Dialogs.SlidingPopoverDemo />
          </Wrapper>
        </Showcase>

        <Showcase
          fileName={Dialogs.AlertDemo.fileName}
          title="React Native API Compatible Alert"
        >
          <Wrapper>
            <Dialogs.AlertDemo />
          </Wrapper>
        </Showcase>
        <Showcase fileName={Dialogs.IosStyleAlert.fileName} title="IOS style Alert">
          <Wrapper>
            <Dialogs.IosStyleAlert />
          </Wrapper>
        </Showcase>
        <Showcase
          fileName={Dialogs.AlertWithIcon.fileName}
          title="Alert with icon and tint color"
        >
          <Wrapper>
            <Dialogs.AlertWithIcon />
          </Wrapper>
        </Showcase>
      </YStack>
    </RecipesShowcaseProvider>
  )
}
