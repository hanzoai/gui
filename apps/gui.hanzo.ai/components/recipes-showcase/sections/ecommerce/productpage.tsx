import { YStack } from 'hanzogui'

import * as ProductPage from '@hanzogui/recipes/component/ecommerce/productpage'
import {
  Showcase,
  ShowcaseChildWrapper as Wrapper,
} from '~/components/recipes-showcase/_Showcase'
import {
  type RecipesShowcaseContext,
  RecipesShowcaseProvider,
} from '~/components/recipes-showcase/RecipesProvider'

export function productpage({ isProUser, showAppropriateModal }: RecipesShowcaseContext) {
  return (
    <RecipesShowcaseProvider
      isProUser={isProUser}
      showAppropriateModal={showAppropriateModal}
    >
      <YStack pb="$10" gap="$12" padding="$2" $gtLg={{ padding: '$0' }}>
        <Showcase
          fileName={ProductPage.ProductWithReview.fileName}
          title="Product with Review"
        >
          <Wrapper p={0}>
            <ProductPage.ProductWithReview />
          </Wrapper>
        </Showcase>
      </YStack>
    </RecipesShowcaseProvider>
  )
}
