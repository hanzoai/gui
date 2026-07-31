import React from 'react'

import type { StaticConfig } from '../types'
import { isGuiComponent } from './isGuiComponent'

export const isGuiElement = (
  child: any,
  name?: string
): child is React.ReactElement<any> & { type: { staticConfig: StaticConfig } } => {
  return React.isValidElement(child) && isGuiComponent(child.type, name)
}
