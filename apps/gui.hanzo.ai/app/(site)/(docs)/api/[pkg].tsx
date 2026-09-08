import type { Href, LoaderProps } from 'one'
import { useLoader } from 'one'
import { H2, H3, Paragraph, Text, XStack, YStack, styled } from '@hanzo/gui'
import { HeadInfo } from '~/components/HeadInfo'
import { Link } from '~/components/Link'
import { SubTitle, nbspLastWord } from '~/components/SubTitle'
import { DocsPageFrame } from '~/features/docs/DocsPageFrame'
import type { Entry } from '~/api'
import { id, named, packages } from '~/features/docs/packages'
import { useDocsMenu } from '~/features/docs/useDocsMenu'
import { HomeH1 } from '~/features/site/home/HomeHeaders'

export async function generateStaticParams() {
  return packages.map((name) => ({ pkg: id(name) }))
}

export async function loader({ params }: LoaderProps<{ pkg: string }>) {
  const { pack } = await import('~/api')
  return pack(named(params.pkg))
}

/** A name is unique per space, so Popover the component and Popover the handle
 *  are two anchors. */
const anchor = (e: Entry) => (e.kind === 'type' ? `type-${e.name}` : e.name)

export default function ApiPackagePage() {
  const pack = useLoader(loader)
  const { next, previous } = useDocsMenu()
  const values = pack.entries.filter((e) => e.kind === 'value').length

  return (
    <DocsPageFrame
      headings={[
        ...(pack.carries.length
          ? [{ id: 'carried', title: 'Carried', priority: 2 }]
          : []),
        ...(pack.entries.length
          ? [{ id: 'exports', title: 'Exports', priority: 2 }]
          : []),
      ]}
      next={next}
      previous={previous}
    >
      <HeadInfo
        title={`${pack.name} — API reference | Gui`}
        description={
          pack.description ??
          `Every export of ${pack.name}, read from the declarations it ships.`
        }
      />

      <HomeH1>{pack.name}</HomeH1>
      <SubTitle>{nbspLastWord(pack.description ?? '')}</SubTitle>

      <Mono color="$color11">
        {`v${pack.version} · ${pack.entry} · ${values} values · ${pack.entries.length - values} types`}
      </Mono>

      {pack.carries.length > 0 && (
        <YStack gap="$3" mt="$6">
          <H2 id="carried" size="$7">
            Carried
          </H2>
          <Paragraph color="$color11">
            These names come from another package and are documented where they are
            declared.
          </Paragraph>
          {pack.carries.map((c) => (
            <YStack key={`${c.from}${c.names?.length ?? 0}`} gap="$1">
              <Paragraph fontFamily="$mono" fontSize={14}>
                {c.href ? <Link href={c.href as Href}>{c.from}</Link> : c.from}
              </Paragraph>
              <Paragraph color="$color11" fontSize={13}>
                {c.names ? c.names.join(', ') : 'everything it exports'}
              </Paragraph>
            </YStack>
          ))}
        </YStack>
      )}

      <YStack gap="$4" mt="$8">
        <H2 id="exports" size="$7">
          Exports
        </H2>
        {pack.entries.length === 0 ? (
          <Paragraph color="$color11">{`${pack.entry} declares no exports.`}</Paragraph>
        ) : (
          pack.entries.map((e) => (
            <YStack key={anchor(e)} gap="$2" mt="$4">
              <XStack items="center" gap="$3">
                <H3 id={anchor(e)} size="$5">
                  {e.name}
                </H3>
                <Tag>{e.kind}</Tag>
              </XStack>
              {e.doc && (
                <Paragraph color="$color11" whiteSpace="pre-wrap">
                  {e.doc}
                </Paragraph>
              )}
              <Block>
                <Mono>{e.signature}</Mono>
              </Block>
              <Mono fontSize={11} color="$color10">
                {`${e.owner}/${e.module}`}
              </Mono>
            </YStack>
          ))
        )}
      </YStack>
    </DocsPageFrame>
  )
}

const Mono = styled(Paragraph, {
  fontFamily: '$mono',
  fontSize: 13,
  lineHeight: 20,
  whiteSpace: 'pre-wrap',
  wordWrap: 'break-word',
})

const Block = styled(YStack, {
  render: 'pre',
  bg: '$color2',
  p: '$3',
  rounded: '$4',
  my: '$1',
})

const Tag = styled(Text, {
  fontFamily: '$mono',
  fontSize: 11,
  px: '$2',
  py: 2,
  rounded: '$2',
  bg: '$color3',
  color: '$color11',
})
