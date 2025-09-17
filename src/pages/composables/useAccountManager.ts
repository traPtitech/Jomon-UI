import { computed, ref } from 'vue'
import { useToast } from 'vue-toastification'

import { useAccountManagerStore } from '/@/features/accountManager/store'
import { useUserStore } from '/@/features/user/store'

export const useAccountManager = () => {
  const { users } = useUserStore()
  const { accountManagers, addAccountManagers, removeAccountManagers } =
    useAccountManagerStore()
  const toast = useToast()

  const absentMembers = computed(() => {
    if (!users.value) {
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

  const addAccountManagersHandler = async (
    accountManagersToBeAdded: string[]
  ) => {
    if (accountManagersToBeAdded.length === 0) {
      toast.warning('1人以上選択してください')
      return
    }
    if (!confirm('本当に追加しますか？')) {
      return
    }
    try {
      isSending.value = true
      await addAccountManagers(accountManagersToBeAdded)
      toast.success('会計管理者を追加しました')
    } catch (e) {
      if (e instanceof Error && e.message) {
        toast.error(e.message)
      } else {
        toast.error('会計管理者の追加に失敗しました')
      }
    }
    isSending.value = false
  }

  const removeAccountManagersHandler = async (
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
      await removeAccountManagers(accountManagersToBeRemoved)
      toast.success('会計管理者を削除しました')
    } catch (e) {
      if (e instanceof Error && e.message) {
        toast.error(e.message)
      } else {
        toast.error('会計管理者の削除に失敗しました')
      }
    }
    isSending.value = false
  }
  return {
    absentMembers,
    isSending,
    addAccountManagers: addAccountManagersHandler,
    removeAccountManagers: removeAccountManagersHandler
  }
}
