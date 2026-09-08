import { STOPS, onTintChange, setTintIndex, useTints } from '@hanzogui/logo'
import { Moon, Sun } from '@hanzogui/lucide-icons-2'
import { useIsIntersecting } from '~/hooks/useOnIntersecting'
import type { SetStateAction } from 'react'
import { memo, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import type { ColorTokens, ThemeName } from '@hanzo/gui'
import {
  Circle,
  Theme,
  XStack,
  YStack,
  debounce,
  useDebounce,
  useEvent,
  useGet,
} from '@hanzo/gui'

import { ActiveCircle } from '~/components/ActiveCircle'
import { ContainerLarge } from '~/components/Containers'
import { accentIndex, setAccent } from '~/features/site/theme/accent'
import { HomeH2, HomeH3 } from './HomeHeaders'
import { MediaPlayer } from './MediaPlayer'
import { useUserScheme } from '@vxrn/color-scheme'

type Lock = null | 'shouldAnimate' | 'animate' | 'scroll'

// A pill of round controls, each keeping its own shape. A Group would not do:
// it zeroes the radius on every connecting side, which is right for segments
// of one bar and wrong for circles, whose rings come out as slabs.
const Row = ({ children, ...props }: { children: any; 'aria-label': string }) => (
  <XStack
    role="group"
    gap="$2"
    $xs={{ gap: '$1' }}
    p="$2"
    self="center"
    rounded="$10"
    borderWidth={1}
    borderColor="$borderColor"
    {...props}
  >
    {children}
  </XStack>
)

export const HomeThemes = memo(function HomeThemes() {
  const userScheme = useUserScheme()

  const tints = useTints().tints as ThemeName[]
  // ONE preview per stop. The second axis used to carry `accent` beside `null`,
  // so every colour appeared twice in the row and the strip read as doubled
  // against a swatch row that names each colour once.
  const themes: (ThemeName | null)[][] = [tints, [null]]

  const themeCombos: string[] = []
  for (let i = 0; i < themes[0].length; i++) {
    for (let j = 0; j < themes[1].length; j++) {
      const parts = [themes[0][i], themes[1][j]].filter(Boolean)
      themeCombos.push(parts.join('_'))
    }
  }

  const max = themes[1].length

  const flatToSplit = (i: number) => {
    const colorI = Math.floor(i / max)
    const shadeI = i % max
    return [colorI, shadeI]
  }

  const splitToFlat = ([a, b]: number[]) => {
    return a * max + b
  }

  const [activeI, setActiveI_] = useState([0, 0])
  const activeIndex = splitToFlat(activeI)

  const [curColorI, curShadeI] = activeI
  const colorName = themes[0][curColorI]
  const scrollView = useRef<HTMLElement | null>(null)
  const [scrollLock, setScrollLock] = useState<Lock>(null)
  const getLock = useGet(scrollLock)
  const setTintIndexDebounce = useDebounce(setTintIndex, 100)

  const updateActiveI = useEvent(
    (to: SetStateAction<number[]>, lock: Lock = 'shouldAnimate') => {
      setScrollLock(lock)
      setActiveI_(to)

      const val = typeof to === 'function' ? to(activeI) : to
      const tintIndex = Math.floor(splitToFlat(val) / max)
      setTintIndexDebounce(tintIndex)
    }
  )

  const isIntersecting = useIsIntersecting(scrollView, {
    threshold: 0.5,
  })

  useEffect(() => {
    if (!isIntersecting) return
    // The stop the person already chose, so a reload lands back on it; the
    // notch when they have chosen nothing.
    updateActiveI([accentIndex(tints), 0])

    const now = Date.now() // ignore immediate one
    const disposeOnChange = onTintChange((index: number) => {
      if (Date.now() - now < 200) return
      moveToIndex(index * max)
    })

    return () => {
      disposeOnChange()
      setTintIndexDebounce.cancel()
    }
  }, [isIntersecting])

  const move = (dir = 0) => {
    updateActiveI((prev) => {
      const next = Math.min(Math.max(0, splitToFlat(prev) + dir), themeCombos.length - 1)
      const nextSplit = flatToSplit(next)
      return nextSplit
    })
  }

  const moveToIndex = (index: number) => {
    updateActiveI(flatToSplit(index))
  }

  const width = 110
  const scale = 0.38

  // Where the row stands for a preview to sit under the demo. Asked of the
  // layout: an arithmetic copy of the padding and the gap drifts from them, and
  // it did — by one gap per stop, so the ninth sat a whole card off centre.
  const stopAt = (node: HTMLElement, index: number) => {
    const item = node.firstElementChild?.children[index] as HTMLElement | undefined
    return item ? item.offsetLeft + (item.offsetWidth - node.clientWidth) / 2 : null
  }

  const scrollToIndex = useEvent((index: number, force = false) => {
    const node = scrollView.current
    const lock = getLock()
    const isReadyToAnimate = lock === 'shouldAnimate'
    const isForced = force && (isReadyToAnimate || lock === null)
    const shouldPrevent = !isReadyToAnimate && !isForced
    if (!node || shouldPrevent) return
    const left = stopAt(node, index)
    if (left === null || Math.abs(node.scrollLeft - left) < 1) return
    node.scrollTo({ left, top: 0, behavior: 'smooth' })
  })

  useEffect(() => {
    if (scrollLock !== 'shouldAnimate') return
    scrollToIndex(activeIndex)
  }, [activeIndex, scrollLock, scrollToIndex])

  if (typeof document !== 'undefined') {
    // scroll lock unset
    useLayoutEffect(() => {
      const node = scrollView.current
      if (!node) return
      const listener = debounce(() => {
        setScrollLock(null)
      }, 200)
      node.addEventListener('scroll', listener, { passive: true })
      return () => {
        node.removeEventListener('scroll', listener)
      }
    }, [])
  }

  // arrow keys
  useEffect(() => {
    if (!isIntersecting) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        move(1)
      }
      if (e.key === 'ArrowLeft') {
        move(-1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
    }
  }, [isIntersecting])

  return (
    <YStack position="relative">
      {useMemo(() => {
        return (
          <ContainerLarge position="relative" gap="$3">
            <HomeH2>Smart themes and sub-themes down to the component.</HomeH2>
            <HomeH3>
              Themes that act like CSS variables, overriding as they descend and compiled
              to CSS to avoid re-renders.
            </HomeH3>
          </ContainerLarge>
        )
      }, [])}

      <YStack my="$8" items="center" justify="center">
        <XStack px="$4" gap="$2" width="100%" justify="center" flexWrap="wrap">
          <Row aria-label="Color scheme">
            {(['light', 'dark'] as const).map((name) => {
              const Icon = name === 'dark' ? Moon : Sun
              return (
                <ActiveCircle
                  key={name}
                  aria-label={name}
                  isActive={userScheme.value === name}
                  onPress={() => userScheme.set(name)}
                >
                  <Icon size={15} color="$color" />
                </ActiveCircle>
              )
            })}
          </Row>

          <Row aria-label="Accent">
            {themes[0].map((color, i) => (
              <ActiveCircle
                key={`${String(color)}${i}`}
                aria-label={String(color)}
                isActive={curColorI === i}
                onPress={() => {
                  updateActiveI([i, curShadeI])
                  setAccent(tints, i)
                }}
              >
                {/* Only the dot wears the stop. Its rings stay the page's own,
                      because white and black carry the ground's own ink, and a
                      ring in it says nothing on the scheme they belong to. */}
                <Theme name={color}>
                  <Circle
                    size={16}
                    bg={
                      `$color${STOPS[String(color)]?.[userScheme.value] ?? 9}` as ColorTokens
                    }
                    borderWidth={1}
                    borderColor="$color"
                  />
                </Theme>
              </ActiveCircle>
            ))}
          </Row>
        </XStack>

        <YStack
          my="$3"
          overflow="hidden"
          width="100%"
          position="relative"
          pointerEvents={scrollLock === 'animate' ? 'none' : 'auto'}
          maxW={1400}
        >
          <YStack fullscreen pointerEvents="none" z={1000000000} />
          <XStack
            className="scroll-horizontal no-scrollbar"
            ref={scrollView as any}
            onScroll={(e: any) => {
              if (scrollLock === 'animate' || scrollLock === 'shouldAnimate') {
                return
              }
              const node = e.target as HTMLElement
              const items = [...node.firstElementChild!.children] as HTMLElement[]
              const mid = node.scrollLeft + node.clientWidth / 2
              const off = (el: HTMLElement) =>
                Math.abs(el.offsetLeft + el.offsetWidth / 2 - mid)
              const itemI = items.reduce(
                (best, el, i) => (off(el) < off(items[best]) ? i : best),
                0
              )
              const [n1, n2] = flatToSplit(itemI)
              const [c1, c2] = activeI
              if (n1 !== c1 || n2 !== c2) {
                updateActiveI([n1, n2], 'scroll')
              }
            }}
          >
            <XStack
              items="center"
              py="$6"
              justify="center"
              gap="$5"
              position="relative"
              px="50%"
            >
              {useMemo(() => {
                return themeCombos.map((name, i) => {
                  const [colorI, shadeI] = flatToSplit(i)
                  const [color, alt] = name.split('_')
                  return (
                    <XStack
                      key={i}
                      width={width}
                      scale={scale}
                      className="all ease-in ms100"
                      cursor="pointer"
                      $xs={{
                        scale: scale * 0.8,
                      }}
                      onPress={() => {
                        updateActiveI([colorI, shadeI])
                      }}
                    >
                      <Theme name={color as any}>
                        <MediaPlayer
                          elevation="$2"
                          pointerEvents="none"
                          alt={alt ? +alt.replace('alt', '') : null}
                        />
                      </Theme>
                    </XStack>
                  )
                })
              }, [])}
            </XStack>
          </XStack>

          <YStack
            className="media-player-main-demo"
            pointerEvents="none"
            fullscreen
            items="center"
            justify="center"
            $xs={{ scale: 0.8 }}
          >
            <Theme name={colorName}>
              <MediaPlayer
                elevation="$3"
                pointerEvents="none"
                pointerEventsControls="auto"
                alt={curShadeI}
              />
            </Theme>
          </YStack>
        </YStack>
      </YStack>
    </YStack>
  )
})
