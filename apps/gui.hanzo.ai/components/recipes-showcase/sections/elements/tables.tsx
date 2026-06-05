import { YStack } from 'hanzogui'

import * as Tables from '@hanzogui/recipes/component/elements/tables'
import {
  Showcase,
  ShowcaseChildWrapper as Wrapper,
} from '~/components/recipes-showcase/_Showcase'
import {
  type RecipesShowcaseContext,
  RecipesShowcaseProvider,
} from '~/components/recipes-showcase/RecipesProvider'

export function tables({ isProUser, showAppropriateModal }: RecipesShowcaseContext) {
  return (
    <RecipesShowcaseProvider
      isProUser={isProUser}
      showAppropriateModal={showAppropriateModal}
    >
      <YStack pb="$10" gap="$12" p="$2" $gtLg={{ p: '$0' }}>
        <Showcase
          unlock
          fileName={Tables.UsersTable.fileName}
          title="Users Table with Avatar"
        >
          <Wrapper>
            <Tables.UsersTable />
          </Wrapper>
        </Showcase>

        <Showcase fileName={Tables.BasicTable.fileName} title="Basic Table">
          <Wrapper>
            <Tables.BasicTable />
          </Wrapper>
        </Showcase>

        <Showcase
          fileName={Tables.SortableTable.fileName}
          title="Table with Pagination and Sorting Ability"
        >
          <Wrapper>
            <Tables.SortableTable />
          </Wrapper>
        </Showcase>
      </YStack>
    </RecipesShowcaseProvider>
  )
}
