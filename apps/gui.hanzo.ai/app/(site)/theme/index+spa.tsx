import { HeadInfo } from '~/components/HeadInfo'
import { ThemePageUpdater } from '~/features/studio/theme/ThemePage'
import { defaultThemeSuiteItem } from '~/features/studio/theme/defaultThemeSuiteItem'

export default () => {
  return (
    <>
      <HeadInfo
        title="Theme Builder"
        description="Create custom Gui themes with the visual theme builder"
      />
      <ThemePageUpdater
        id={0}
        search=""
        theme={defaultThemeSuiteItem as any}
        user_name={null}
      />
    </>
  )
}
