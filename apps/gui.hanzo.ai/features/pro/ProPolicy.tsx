import { H1, H3, Paragraph, Separator, YStack } from 'hanzogui'

export const ProPolicy = () => {
  return (
    <YStack gap="$4">
      <H1 $sm={{ size: '$8' }}>Fulfillment Policies</H1>

      <H3>Delivery</H3>

      <Paragraph>
        GUI LLC will deliver to you access to the Takeout Github repo, Recipes copy and
        paste the code for all the examples on the /recipes main page, and the Theme AI
        builder.
      </Paragraph>

      <H3>Returns and Refunds</H3>

      <Paragraph>
        Recipes is not able to be returned as it is digital software, but for exceptional
        cases where things are breaking on Mac we do accept refunds within 48 hours. Get
        in touch with support at support@hanzo.ai.
      </Paragraph>

      <Separator />

      <Paragraph>
        For any further questions <a href="mailto:support@hanzo.ai">send us an email</a>.
      </Paragraph>
    </YStack>
  )
}
