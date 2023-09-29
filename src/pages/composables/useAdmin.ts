import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { useToast } from 'vue-toastification'

import { useAdminStore } from '/@/stores/admin'
import { useUserStore } from '/@/stores/user'

import {
  addAdminsUsecase,
  removeAdminsUsecase
} from '/@/features/admin/usecase'

export const useAdmin = () => {
  const { users } = storeToRefs(useUserStore())
  const { admins } = storeToRefs(useAdminStore())
  const toast = useToast()

  const absentMembers = computed(() => {
    if (users.value === undefined || admins === undefined) {
      return []
    }
    return users.value
      .filter(user => !admins.value?.includes(user.id))
      .map(user => ({
        key: user.name,
        value: user.id
      }))
  })

  const isSending = ref(false)

  const addAdmins = async (adminsToBeAdded: string[]) => {
    if (adminsToBeAdded.length === 0) {
      toast.warning('1人以上選択してください')
      return
    }
    if (!confirm('本当に追加しますか？')) {
      return
    }
    try {
      isSending.value = true
      await addAdminsUsecase(adminsToBeAdded)
      toast.success('管理者を追加しました')
    } catch (e) {
      if (e instanceof Error) {
        toast.error(e.message)
      }
    }
    isSending.value = false
  }

  const removeAdmins = async (adminsToBeRemoved: string[]) => {
    if (adminsToBeRemoved.length === 0) {
      toast.warning('1人以上選択してください')
      return
    }
    if (!confirm('本当に削除しますか？')) {
      return
    }
    try {
      isSending.value = true
      await removeAdminsUsecase(adminsToBeRemoved)
      toast.success('管理者を削除しました')
    } catch (e) {
      if (e instanceof Error) {
        toast.error(e.message)
      }
    }
    isSending.value = false
  }
  return { absentMembers, isSending, addAdmins, removeAdmins }
}
