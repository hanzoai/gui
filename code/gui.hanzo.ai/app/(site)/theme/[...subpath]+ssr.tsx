import type { LoaderProps } from 'one'
import { useLoader } from 'one'
import { HeadInfo } from '~/components/HeadInfo'
import { getTheme } from '~/features/studio/theme/getTheme'
import { ThemePageUpdater } from '~/features/studio/theme/ThemePage'

export async function loader(props: LoaderProps) {
  const subpath = props.params.subpath || ''
  // could be `/10/vercel` or something but we only want the id
  // @ts-ignore
  const id = subpath.includes('/') ? subpath.split('/')[0] : subpath

  console.info(`Fetching theme`, id)

  try {
    return await getTheme(id, props.request)
  } catch (err) {
    console.error(`Error loading theme`, err)
    return null
  }
}

export default function ThemeLayout() {
  const data = useLoader(loader)

  if (!data) {
    return null
  }

  return (
    <>
      <HeadInfo
        title={`${data.search || 'Gui Theme Builder'} - Hanzo GUI Theme`}
        description={data.search ? `Gui Theme for ${data.search}` : `Gui Theme Builder`}
        openGraph={{
          url: `/api/theme/open-graph?id=${data.id || '0'}`,
          images: [
            {
              url: `/api/theme/open-graph?id=${data.id || '0'}`,
            },
          ],
        }}
      />
      <ThemePageUpdater {...data} />
    </>
  )
}
