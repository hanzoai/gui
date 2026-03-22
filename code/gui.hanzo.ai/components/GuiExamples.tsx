import type { getCompilationExamples } from '~/features/mdx/getMDXBySlug'
import { createContext, useContext } from 'react'
import { Spacer } from '@hanzo/gui'
import { HeroContainer } from '~/features/docs/HeroContainer'
import { HomeExamples } from '~/features/site/home/HomeExamples'

export const GuiExamples = createContext<ReturnType<
  typeof getCompilationExamples
> | null>(null)

export function GuiExamplesCode() {
  try {
    const examples = useContext(GuiExamples)
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
