/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import { Platform } from '@hanzogui/react-native-web-internals'
import { AnimatedImplementation } from './AnimatedImplementation.js'
import { AnimatedMock } from './AnimatedMock.js'
import { FlatList } from './components/AnimatedFlatList.js'
import { AnimatedImage as Image } from './components/AnimatedImage.js'
import { ScrollView } from './components/AnimatedScrollView.js'
import { SectionList } from './components/AnimatedSectionList.js'
import { AnimatedText as Text } from './components/AnimatedText.js'
import { AnimatedView as View } from './components/AnimatedView.js'

const Animated = Platform.isTesting ? AnimatedMock : AnimatedImplementation

const AnimatedExports = {
  FlatList,
  Image,
  ScrollView,
  SectionList,
  Text,
  View,
  ...Animated,
}

export { AnimatedExports }
export default AnimatedExports
