import { useAccountManagerRepository } from './data/repository'
import { useUserStore } from '@/features/user/store'
import { defineStore, storeToRefs } from 'pinia'
import { computed, ref } from 'vue'

const createAccountManagerStore = defineStore('accountManager', () => {
  const accountManagers = ref<string[]>([])
  const isAccountManagerFetched = ref(false)

  const accountManagerOptions = computed(() => {
    const { userMap } = useUserStore()
    return accountManagers.value.map(accountManager => ({
      key: userMap.value[accountManager],
      value: accountManager
    }))
  })

  const fetchAccountManagers = async () => {
    const repository = useAccountManagerRepository()

    try {
      accountManagers.value = await repository.fetchAccountManagers()
      isAccountManagerFetched.value = true
    } catch {
      throw new Error('会計管理者の取得に失敗しました')
    }
  }

  const addAccountManagers = async (newAccountManagers: string[]) => {
    if (newAccountManagers.length === 0) return
    const repository = useAccountManagerRepository()

    try {
      await repository.addAccountManagers(newAccountManagers)
      accountManagers.value = Array.from(
        new Set([...accountManagers.value, ...newAccountManagers])
      )
    } catch {
      throw new Error('会計管理者の追加に失敗しました')
    }
  }

  const removeAccountManagers = async (targetAccountManagers: string[]) => {
    if (targetAccountManagers.length === 0) return
    const repository = useAccountManagerRepository()

    try {
      await repository.removeAccountManagers(targetAccountManagers)
      accountManagers.value = accountManagers.value.filter(
        accountManager => !targetAccountManagers.includes(accountManager)
      )
    } catch {
      throw new Error('会計管理者の削除に失敗しました')
    }
  }

  const reset = () => {
    accountManagers.value = []
    isAccountManagerFetched.value = false
  }

  return {
    accountManagers,
    isAccountManagerFetched,
    accountManagerOptions,
    fetchAccountManagers,
    addAccountManagers,
    removeAccountManagers,
    reset
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
