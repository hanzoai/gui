import React from 'react'

import type { StaticConfig } from '../types'
import { isHanzoguiComponent } from './isHanzoguiComponent'

export const isHanzoguiElement = (
  child: any,
  name?: string
): child is React.ReactElement<any> & { type: { staticConfig: StaticConfig } } => {
  return React.isValidElement(child) && isHanzoguiComponent(child.type, name)
}
