import { YStack } from '@hanzo/gui'
import { HeadInfo } from '~/components/HeadInfo'
import { ProLicense } from '~/features/pro/ProLicense'

export default () => (
  <>
    <HeadInfo title="Pro License" />
    <YStack p="$8">
      <ProLicense />
    </YStack>
  </>
)
