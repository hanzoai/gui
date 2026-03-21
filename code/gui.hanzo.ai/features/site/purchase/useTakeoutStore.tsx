import { createUseStore } from '@hanzo/gui-use-store'

class TakeoutStore {
  showPurchase = false

  showProAgreement = false
  showProPolicies = false

  showTakeoutFaq = false
  showTakeoutAgreement = false
}

export const useTakeoutStore = createUseStore(TakeoutStore)
