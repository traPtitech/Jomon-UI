import { computed, ref } from 'vue'
import { useToast } from 'vue-toastification'

import { useAccountManagerStore } from '/@/stores/accountManager'
import { useUserStore } from '/@/stores/user'

import {
  addAccountManagersUsecase,
  removeAccountManagersUsecase
} from '/@/features/accountManager/usecase'

export const useAccountManager = () => {
  const { users } = useUserStore()
  const { accountManagers } = useAccountManagerStore()
  const toast = useToast()

  const absentMembers = computed(() => {
    if (users.value === undefined || accountManagers.value === undefined) {
      return []
    }
    return users.value
      .filter(user => !accountManagers.value?.includes(user.id))
      .map(user => ({
        key: user.name,
        value: user.id
      }))
  })

  const isSending = ref(false)

  const addAccountManagers = async (accountManagersToBeAdded: string[]) => {
    if (accountManagersToBeAdded.length === 0) {
      toast.warning('1人以上選択してください')
      return
    }
    if (!confirm('本当に追加しますか？')) {
      return
    }
    try {
      isSending.value = true
      await addAccountManagersUsecase(accountManagersToBeAdded)
      toast.success('会計管理者を追加しました')
    } catch (e) {
      if (e instanceof Error) {
        toast.error(e.message)
      }
    }
    isSending.value = false
  }

  const removeAccountManagers = async (
    accountManagersToBeRemoved: string[]
  ) => {
    if (accountManagersToBeRemoved.length === 0) {
      toast.warning('1人以上選択してください')
      return
    }
    if (!confirm('本当に削除しますか？')) {
      return
    }
    try {
      isSending.value = true
      await removeAccountManagersUsecase(accountManagersToBeRemoved)
      toast.success('会計管理者を削除しました')
    } catch (e) {
      if (e instanceof Error) {
        toast.error(e.message)
      }
    }
    isSending.value = false
  }
  return { absentMembers, isSending, addAccountManagers, removeAccountManagers }
}
