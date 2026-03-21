import { Configuration } from '@hanzo/gui-web'
import { animationsMotion } from '@hanzo/gui-config/v5-motion'
import { Slot } from 'one'
import { Header } from '~/features/site/header/Header'

export default function MotionBugLayout() {
  return (
    <Configuration animationDriver={animationsMotion}>
      <Header />
      <Slot />
    </Configuration>
  )
}
