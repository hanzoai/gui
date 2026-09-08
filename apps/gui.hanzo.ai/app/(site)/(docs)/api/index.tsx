import type { Href } from 'one'
import { useLoader } from 'one'
import { H2, Paragraph, Text, XStack, YStack } from '@hanzo/gui'
import { HeadInfo } from '~/components/HeadInfo'
import { Link } from '~/components/Link'
import { SubTitle } from '~/components/SubTitle'
import { DocsPageFrame } from '~/features/docs/DocsPageFrame'
import { useDocsMenu } from '~/features/docs/useDocsMenu'
import { HomeH1 } from '~/features/site/home/HomeHeaders'

export async function loader() {
  const { overview } = await import('~/api')
  return overview()
}

export default function ApiIndexPage() {
  const packs = useLoader(loader)
  const { next, previous } = useDocsMenu()

  return (
    <DocsPageFrame
      headings={[{ id: 'packages', title: 'Packages', priority: 2 }]}
      next={next}
      previous={previous}
    >
      <HeadInfo
        title="API reference | Gui"
        description="Every export of every package, read from the declarations they ship."
      />

      <HomeH1>API reference</HomeH1>
      <SubTitle>
        Read from the declarations each package ships, so it says what the code says.
      </SubTitle>

      <YStack gap="$3" mt="$6">
        <H2 id="packages" size="$7">
          Packages
        </H2>
        {packs.map((p) => (
          <Link key={p.name} href={p.href as Href}>
            <YStack
              gap="$1"
              p="$4"
              rounded="$4"
              borderWidth={1}
              borderColor="$borderColor"
              hoverStyle={{ borderColor: '$color5' }}
            >
              <XStack items="center" gap="$3">
                <Text fontFamily="$mono" fontSize={15} color="$color12">
                  {p.name}
                </Text>
                <Text fontFamily="$mono" fontSize={12} color="$color10">
                  {`v${p.version}`}
                </Text>
              </XStack>
              {p.description && <Paragraph color="$color11">{p.description}</Paragraph>}
              <Paragraph fontFamily="$mono" fontSize={12} color="$color10">
                {`${p.values} values · ${p.types} types`}
              </Paragraph>
            </YStack>
          </Link>
        ))}
      </YStack>
    </DocsPageFrame>
  )
}
