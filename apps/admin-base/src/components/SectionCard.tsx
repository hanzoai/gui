// Tamagui SectionCard. Replaces the legacy HTML/CSS version. Used as
// the chrome for each settings sub-form: title row + optional
// description + content slot.

import type { ReactNode } from 'react'
import { Card, Text, YStack } from 'hanzogui'

export interface SectionCardProps {
  title: string
  description?: string
  children: ReactNode
}

export function SectionCard({ title, description, children }: SectionCardProps) {
  return (
    <Card
      bg="$background"
      borderColor="$borderColor"
      borderWidth={1}
      p="$5"
      gap="$3"
    >
      <YStack gap="$1">
        <Text
          fontSize="$2"
          fontWeight="600"
          color="$color"
          letterSpacing={1}
          textTransform={'uppercase' as any}
        >
          {title}
        </Text>
        {description ? (
          <Text fontSize="$2" color="$placeholderColor">
            {description}
          </Text>
        ) : null}
      </YStack>
      <YStack gap="$3">{children}</YStack>
    </Card>
  )
}
