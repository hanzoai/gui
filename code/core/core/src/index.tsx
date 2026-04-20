// re-exports all of @hanzogui/web just adds hooks
export * from '@hanzogui/web'

import { createMedia } from '@hanzogui/react-native-media-driver'
import { isWeb } from '@hanzogui/constants'
import {
  createMeasure,
  createMeasureInWindow,
  createMeasureLayout,
  enable,
  useElementLayout,
} from '@hanzogui/use-element-layout'
import type {
  StackNonStyleProps,
  StackStyleBase,
  TamaDefer,
  HanzoguiComponent,
  HanzoguiElement,
  HanzoguiProviderProps,
  HanzoguiTextElement,
  TextNonStyleProps,
  TextProps,
  TextStylePropsBase,
} from '@hanzogui/web'
import {
  HanzoguiProvider as WebHanzoguiProvider,
  Text as WebText,
  View as WebView,
  createHanzogui as createHanzoguiWeb,
  setupHooks,
  useIsomorphicLayoutEffect,
} from '@hanzogui/web'
import { createOptimizedView } from './createOptimizedView'
import { getBaseViews } from './getBaseViews'
import type { RNTextProps, RNViewProps } from './reactNativeTypes'

// helpful for usage outside of hanzogui
export {
  LayoutMeasurementController,
  registerLayoutNode,
  setOnLayoutStrategy,
  type LayoutEvent,
} from '@hanzogui/use-element-layout'

// adds extra types to View/Stack/Text:

type RNExclusiveViewProps = Omit<RNViewProps, keyof StackNonStyleProps>
export interface RNHanzoguiViewNonStyleProps
  extends StackNonStyleProps, RNExclusiveViewProps {}

type RNHanzoguiView = HanzoguiComponent<
  TamaDefer,
  HanzoguiElement,
  RNHanzoguiViewNonStyleProps,
  StackStyleBase,
  {}
>

type RNExclusiveTextProps = Omit<RNTextProps, keyof TextProps>
export interface RNHanzoguiTextNonStyleProps
  extends TextNonStyleProps, RNExclusiveTextProps {}

type RNHanzoguiText = HanzoguiComponent<
  TamaDefer,
  HanzoguiTextElement,
  RNHanzoguiTextNonStyleProps,
  TextStylePropsBase,
  {}
>

// fixes issues with TS saying internal type usage is breaking
// see https://discord.com/channels/909986013848412191/1146150253490348112/1146150253490348112
export * from './reactNativeTypes'

// adds useElementLayout enable
export const HanzoguiProvider = (props: HanzoguiProviderProps) => {
  useIsomorphicLayoutEffect(() => {
    enable()
  }, [])

  return <WebHanzoguiProvider {...props} />
}

// automate using the react native media driver
export const createHanzogui: typeof createHanzoguiWeb = (conf) => {
  if (!isWeb) {
    if (conf.media) {
      conf.media = createMedia(conf.media)
    }
  }
  return createHanzoguiWeb(conf)
}

const baseViews = getBaseViews()

// setup internal hooks:

setupHooks({
  getBaseViews,

  setElementProps: (node) => {
    if (process.env.TAMAGUI_TARGET === 'web') {
      // web only
      if (node && !node['measure']) {
        node.measure ||= createMeasure(node)
        node.measureInWindow ||= createMeasureInWindow(node)
        node.measureLayout ||= createMeasureLayout(node)
      }
    }
  },

  usePropsTransform(elementType, propsIn, stateRef, willHydrate) {
    if (process.env.TAMAGUI_TARGET === 'web') {
      const isDOM = typeof elementType === 'string'

      // replicate react-native-web functionality
      const {
        // remove event props handles by useResponderEvents
        onMoveShouldSetResponder,
        onMoveShouldSetResponderCapture,
        onResponderEnd,
        onResponderGrant,
        onResponderMove,
        onResponderReject,
        onResponderRelease,
        onResponderStart,
        onResponderTerminate,
        onResponderTerminationRequest,
        onScrollShouldSetResponder,
        onScrollShouldSetResponderCapture,
        onSelectionChangeShouldSetResponder,
        onSelectionChangeShouldSetResponderCapture,
        onStartShouldSetResponder,
        onStartShouldSetResponderCapture,

        // android
        collapsable,
        focusable,

        // deprecated,
        accessible,
        accessibilityDisabled,

        onLayout,
        hrefAttrs,

        ...plainDOMProps
      } = propsIn

      if (willHydrate || isDOM) {
        useElementLayout(stateRef, !isDOM ? undefined : (onLayout as any))
        // responder events removed for web - use native pointer/touch events instead
        // the onResponder* props are stripped above and not passed to DOM
      }

      if (isDOM) {
        // TODO move into getSplitStyles
        if (plainDOMProps.href && hrefAttrs) {
          const { download, rel, target } = hrefAttrs
          if (download != null) {
            plainDOMProps.download = download
          }
          if (rel) {
            plainDOMProps.rel = rel
          }
          if (typeof target === 'string') {
            plainDOMProps.target = target.charAt(0) !== '_' ? `_${target}` : target
          }
        }
        return plainDOMProps
      }
    }
  },

  // attempt at properly fixing RN input, but <Pressable><TextInput /> just doesnt work on RN
  ...(process.env.TAMAGUI_TARGET === 'native' && {
    useChildren(elementType, children, viewProps) {
      if (process.env.NODE_ENV === 'test') {
        // test mode - just use regular views since optimizations cause weirdness
        return
      }

      if (elementType === baseViews.View && baseViews.TextAncestor) {
        // optimize view
        return createOptimizedView(children, viewProps, baseViews)
      }
    },
  }),
})

// overwrite web versions:
// putting at the end ensures it overwrites in dist/cjs/index.js
export const View = WebView as any as RNHanzoguiView
export const Text = WebText as any as RNHanzoguiText

// easily test type declaration output and if it gets messy:

// export const X = styled(WebView, {
//   variants: {
//     abc: {
//       true: {},
//     },
//   } as const,
// })

// export const Y = styled(X, {
//   variants: {
//     zys: {
//       true: {},
//     },
//   } as const,
// })

// export const Z = styled(Y, {
//   variants: {
//     xxx: {
//       true: {},
//     },
//   } as const,
// })

// export const A = styled(Z, {
//   variants: {} as const,
// })

// const zz = <A />

// const variants = {
//   fullscreen: {
//     true: {},
//   },
//   elevation: {
//     '...size': () => ({}),
//     ':number': () => ({}),
//   },
// } as const

// export const YStack = styled(View, {
//   flexDirection: 'column',
//   variants,
// })

// import { TextInput } from 'react-native'
// export const InputFrame = styled(
//   TextInput,
//   {
//     name: 'Input',
//     backgroundColor: 'green',

//     variants: {
//       // unstyled: {
//       //   false: {},
//       // },

//       size: {
//         '...size': () => ({}),
//       },

//       // disabled: {
//       //   ':boolean': () => ({})
//       // },
//     } as const,

//     // defaultVariants: {
//     //   unstyled: process.env.HANZOGUI_HEADLESS === '1' ? true : false,
//     // },
//   },
//   {
//     isText: true,
//     accept: {
//       placeholderTextColor: 'color',
//     },
//   }
// )

// export const StyledInputFrame = styled(InputFrame, {
//   fontSize: 16,
//   fontFamily: '$silkscreen',
//   color: '$color5',
//   minWidth: 0,
//   borderWidth: 0,
//   borderColor: 'transparent',

//   variants: {
//     unset: {
//       false: {
//         borderWidth: 2,
//         py: 12,
//         px: 14,
//         borderRadius: 6,
//         bg: '$color3',
//         focusStyle: {
//           bg: '$color4',
//           margin: 0,
//         },
//       },
//     },
//   } as const,

//   defaultVariants: {
//     unset: false,
//   },
// })

// export const StyledStyledInputFrame = styled(
//   StyledInputFrame,
//   {
//     fontSize: 16,
//     fontFamily: '$silkscreen',
//     color: '$color5',
//     minWidth: 0,
//     borderWidth: 0,
//     borderColor: 'transparent',

//     variants: {
//       unset: {
//         false: {
//           borderWidth: 2,
//           py: 12,
//           px: 14,
//           borderRadius: 6,
//           bg: '$color3',
//           focusStyle: {
//             bg: '$color4',
//             margin: 0,
//           },
//         },
//       },
//     } as const,

//     defaultVariants: {
//       unset: false,
//     },
//   },
//   {
//     inlineProps: new Set(['id', 'testID']),
//   }
// )
// export const DepthTest = () => <StyledStyledInputFrame placeholder="" />
