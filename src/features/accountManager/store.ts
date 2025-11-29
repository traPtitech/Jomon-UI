import { AccountManagerRepositoryKey } from '@/di'
import { useUserStore } from '@/features/user/store'
import { defineStoreComposable } from '@/lib/store'
import type { AsyncStatus } from '@/types'
import { computed, inject, ref } from 'vue'

export const useAccountManagerStore = defineStoreComposable(
  'accountManager',
  () => {
    const repository = inject(AccountManagerRepositoryKey)
    if (!repository) throw new Error('AccountManagerRepository is not provided')

    const accountManagers = ref<string[]>([])
    const status = ref<AsyncStatus>('idle')
    const error = ref<string | null>(null)

    const accountManagerOptions = computed(() => {
      const { userMap } = useUserStore()
      return accountManagers.value.map(accountManager => ({
        key: userMap.value[accountManager],
        value: accountManager
      }))
    })

    const isAccountManagerFetched = computed(() => status.value === 'success')

    const fetchAccountManagers = async () => {
      status.value = 'loading'
      error.value = null

      try {
        accountManagers.value = await repository.fetchAccountManagers()
        status.value = 'success'
      } catch (e) {
        status.value = 'error'
        error.value =
          '会計管理者の取得に失敗しました: ' +
          (e instanceof Error ? e.message : String(e))
        throw new Error(error.value)
      }
    }

    const addAccountManagers = async (newAccountManagers: string[]) => {
      if (newAccountManagers.length === 0) return

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
      status.value = 'idle'
      error.value = null
    }

    return {
      accountManagers,
      status,
      error,
      isAccountManagerFetched,
      accountManagerOptions,
      fetchAccountManagers,
      addAccountManagers,
      removeAccountManagers,
      reset
    }
  }
)

export type AccountManagerStore = ReturnType<typeof useAccountManagerStore>
