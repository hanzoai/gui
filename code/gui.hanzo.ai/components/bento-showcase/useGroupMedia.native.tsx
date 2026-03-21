import type { UseMediaState } from '@hanzo/gui-web'
import { useMedia } from '@hanzo/gui'

export const useGroupMedia = (name: string): UseMediaState => {
  const allMedia = useMedia()

  return allMedia
}
