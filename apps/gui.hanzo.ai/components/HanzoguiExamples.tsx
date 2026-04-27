import type { getCompilationExamples } from '~/features/mdx/getMDXBySlug'
import { createContext, useContext } from 'react'
import { Spacer } from 'hanzogui'
import { HeroContainer } from '~/features/docs/HeroContainer'
import { HomeExamples } from '~/features/site/home/HomeExamples'

export const HanzoguiExamples = createContext<ReturnType<
  typeof getCompilationExamples
> | null>(null)

export function HanzoguiExamplesCode() {
  try {
    const examples = useContext(HanzoguiExamples)
    return (
      <HeroContainer noScroll noPad>
        <Spacer />
        <HomeExamples onlyDemo examples={examples?.compilationExamples} />
        <Spacer />
      </HeroContainer>
    )
  } catch {
    return null
  }
}
