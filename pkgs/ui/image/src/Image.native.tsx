import { Image as RNImage } from 'react-native'
import { createImage } from './createImage.tsx'

export const Image = createImage({
  Component: RNImage,
})
