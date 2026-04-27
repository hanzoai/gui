// LoginShowcase — the right-side panel of the split-screen login.
// Brand-neutral: reads `displayName` and `description` straight from
// the application object. No hardcoded copy.
//
// Original at `~/work/hanzo/iam/web/src/LoginShowcase.tsx`. The
// upstream version is also "drop heavy embellishments"-light; this
// port keeps the single sentence + tagline shape.

import { H1, Paragraph, YStack } from 'hanzogui'
import type { Application } from './types'

export interface LoginShowcaseProps {
  application?: Pick<Application, 'displayName' | 'description'>
}

export function LoginShowcase({ application }: LoginShowcaseProps) {
  const displayName = application?.displayName || 'Sign In'
  const tagline = application?.description || ''
  return (
    <YStack
      flex={1}
      items="center"
      content="center"
      p="$6"
      bg={'rgba(0,0,0,0.30)' as never}
    >
      <YStack gap="$3" maxWidth={520}>
        <H1 size="$10" fontWeight="700">
          {displayName}
        </H1>
        {tagline ? (
          <Paragraph fontSize="$5" color="$placeholderColor">
            {tagline}
          </Paragraph>
        ) : null}
      </YStack>
    </YStack>
  )
}
