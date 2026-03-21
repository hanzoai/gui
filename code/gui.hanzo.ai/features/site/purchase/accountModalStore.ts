import { createStore, createUseStore } from '@hanzo/gui-use-store'

class AccountModal {
  show = false
}

export const accountModal = createStore(AccountModal)
export const useAccountModal = createUseStore(AccountModal)
