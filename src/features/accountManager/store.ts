import { defineStore, storeToRefs } from 'pinia'

import { useAccountManagerRepository } from './data/repository'
import { useUserStore } from '/@/features/user/store'

const createAccountManagerStore = defineStore('accountManager', {
  state: () => ({
    accountManagers: [] as string[],
    isAccountManagerFetched: false
  }),
  getters: {
    accountManagerOptions(state) {
      const { userMap } = useUserStore()
      return state.accountManagers.map(accountManager => ({
        key: userMap.value[accountManager],
        value: accountManager
      }))
    }
  },
  actions: {
    async fetchAccountManagers() {
      const repository = useAccountManagerRepository()

      try {
        this.accountManagers = await repository.fetchAccountManagers()
        this.isAccountManagerFetched = true
      } catch {
        throw new Error('会計管理者の取得に失敗しました')
      }
    },
    async addAccountManagers(accountManagers: string[]) {
      if (accountManagers.length === 0) return
      const repository = useAccountManagerRepository()

      try {
        await repository.addAccountManagers(accountManagers)
        this.accountManagers = Array.from(
          new Set([...this.accountManagers, ...accountManagers])
        )
      } catch {
        throw new Error('会計管理者の追加に失敗しました')
      }
    },
    async removeAccountManagers(accountManagers: string[]) {
      if (accountManagers.length === 0) return
      const repository = useAccountManagerRepository()

      try {
        await repository.removeAccountManagers(accountManagers)
        this.accountManagers = this.accountManagers.filter(
          accountManager => !accountManagers.includes(accountManager)
        )
      } catch {
        throw new Error('会計管理者の削除に失敗しました')
      }
    },
    reset() {
      this.accountManagers = []
      this.isAccountManagerFetched = false
    }
  }
})

export const useAccountManagerStore = () => {
  const store = createAccountManagerStore()
  const refs = storeToRefs(store)

  return {
    ...refs,
    fetchAccountManagers: store.fetchAccountManagers,
    addAccountManagers: store.addAccountManagers,
    removeAccountManagers: store.removeAccountManagers,
    reset: store.reset
  }
}

export type AccountManagerStore = ReturnType<typeof useAccountManagerStore>
