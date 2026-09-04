/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import { isDisabled } from './isDisabled.tsx'
import { propsToAccessibilityComponent } from './propsToAccessibilityComponent.tsx'
import { propsToAriaRole } from './propsToAriaRole.tsx'

export const AccessibilityUtil = {
  isDisabled,
  propsToAccessibilityComponent,
  propsToAriaRole,
}
