import { YStack } from 'hanzogui'

import * as Payment from '@hanzogui/recipes/component/ecommerce/payment'
import { Showcase } from '~/components/recipes-showcase/_Showcase'
import {
  type RecipesShowcaseContext,
  RecipesShowcaseProvider,
} from '~/components/recipes-showcase/RecipesProvider'

export function payment({ isProUser, showAppropriateModal }: RecipesShowcaseContext) {
  return (
    <RecipesShowcaseProvider
      isProUser={isProUser}
      showAppropriateModal={showAppropriateModal}
    >
      <YStack pb="$10" gap="$12" padding="$2" $gtLg={{ padding: '$0' }}>
        <Showcase fileName={Payment.Fullpage.fileName} title="Shopping Cart">
          <Payment.Fullpage />
        </Showcase>

        <YStack pb="$10" gap="$12" padding="$2" $gtLg={{ padding: '$0' }}>
          <Showcase fileName={Payment.Paywall.fileName} title={Payment.Paywall.title}>
            <Payment.Paywall />
          </Showcase>
        </YStack>
      </YStack>
    </RecipesShowcaseProvider>
  )
}

export function paymentGetComponentCodes() {
  return {
    codes: {
      Fullpage: '',
      Paywall: '',
    } as Omit<Record<keyof typeof Payment, string>, 'getCode'>,
  }
}
