import { Suspense, useRef, type ReactNode } from 'react'
import { YStack } from '@hanzo/gui'
import { useIsIntersecting } from '~/hooks/useOnIntersecting'

// A section below the fold. Its code is a separate chunk, and it mounts once it
// comes within a screen of the viewport; `height` holds its room until then so
// the page does not shift and the tint observers see the right geometry.
export const Near = ({ height, children }: { height: number; children: ReactNode }) => {
  const ref = useRef<HTMLElement>(null)
  const near = useIsIntersecting(ref, { once: true, rootMargin: '900px' })
  return (
    <YStack ref={ref as any} minH={near ? 0 : height}>
      {near ? <Suspense fallback={null}>{children}</Suspense> : null}
    </YStack>
  )
}
