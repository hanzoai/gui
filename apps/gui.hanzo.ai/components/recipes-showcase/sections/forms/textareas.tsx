import { YStack } from 'hanzogui'

import * as TextAreas from '@hanzogui/recipes/component/forms/textareas'
import {
  Showcase,
  ShowcaseChildWrapper as Wrapper,
} from '~/components/recipes-showcase/_Showcase'
import {
  type RecipesShowcaseContext,
  RecipesShowcaseProvider,
} from '~/components/recipes-showcase/RecipesProvider'

type Props = ReturnType<typeof textareasGetComponentCodes> & RecipesShowcaseContext

export function textareas({ isProUser, showAppropriateModal }: Props) {
  return (
    <RecipesShowcaseProvider
      isProUser={isProUser}
      showAppropriateModal={showAppropriateModal}
    >
      <YStack pb="$10" gap="$12" p="$2" $gtLg={{ p: '$0' }}>
        <Showcase
          unlock
          fileName={TextAreas.WritePreviewAction.fileName}
          title="Comment Box with Preview"
        >
          <Wrapper>
            <TextAreas.WritePreviewAction />
          </Wrapper>
        </Showcase>

        <Showcase
          fileName={TextAreas.AvatarNameContentAction.fileName}
          title="Comment Box"
        >
          <Wrapper>
            <TextAreas.AvatarNameContentAction />
          </Wrapper>
        </Showcase>

        <Showcase
          fileName={TextAreas.AvatarOutContentAction.fileName}
          title="Comment Box Floating"
        >
          <Wrapper>
            <TextAreas.AvatarOutContentAction />
          </Wrapper>
        </Showcase>

        <Showcase
          fileName={TextAreas.TitleContentMessage.fileName}
          title="Comment Box Minimal"
        >
          <Wrapper>
            <TextAreas.TitleContentMessage />
          </Wrapper>
        </Showcase>
      </YStack>
    </RecipesShowcaseProvider>
  )
}

export function textareasGetComponentCodes() {
  return {
    codes: {
      AvatarNameContentAction: '',
      AvatarOutContentAction: '',
      TitleContentMessage: '',
      WritePreviewAction: '',
    } as Omit<Record<keyof typeof TextAreas, string>, 'getCode'>,
  }
}
