import type { UseMediaState } from '@hanzogui/web'
import { useMedia } from 'hanzogui'

export const useGroupMedia = (name: string): UseMediaState => {
  const allMedia = useMedia()

  return allMedia
}
