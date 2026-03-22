import * as Helpers from '@hanzo/gui-helpers'

import { getConfig } from './config'
import { getAllRules, getAllSelectors } from './helpers/insertStyleRule'
import { mediaState } from './helpers/mediaState'

// easy introspection
// only included in dev mode

export const Gui = (() => {
  if (process.env.NODE_ENV === 'development') {
    class GuiManager {
      Helpers = Helpers

      get mediaState() {
        return { ...mediaState }
      }

      get config() {
        return getConfig()
      }

      get insertedRules() {
        return getAllRules()
      }

      get allSelectors() {
        return getAllSelectors()
      }

      get identifierToValue() {
        return identifierToValue
      }
    }
    return new GuiManager()
  }
})()

const identifierToValue = new Map<string, any>()

export const getValueFromIdentifier = (identifier: string) => {
  return identifierToValue.get(identifier)
}

export const setIdentifierValue = (identifier: string, value: any) => {
  identifierToValue.set(identifier, value)
}
