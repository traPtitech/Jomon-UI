import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { useToast } from 'vue-toastification'

import { useAdminStore } from '/@/stores/admin'
import { useUserStore } from '/@/stores/user'

import apis from '/@/lib/apis'

export const useAdmin = () => {
  const { users } = storeToRefs(useUserStore())
  const { admins } = storeToRefs(useAdminStore())
  const toast = useToast()

  const absentMembers = computed(() => {
    if (users.value !== undefined && admins !== undefined) {
      return users.value
        .filter(user => !admins.value?.includes(user.id))
        .map(user => {
          return {
            key: user.name,
            value: user.id
          }
        })
    } else {
      return []
    }
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
      await apis.postAdmins(adminsToBeAdded)
      if (admins.value !== undefined) {
        admins.value.push(...adminsToBeAdded)
      } else {
        admins.value = adminsToBeAdded
      }
      toast.success('管理者を追加しました')
    } catch {
      toast.error('管理者の追加に失敗しました')
    } finally {
      isSending.value = false
    }
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
      await apis.deleteAdmins(adminsToBeRemoved)
      if (admins.value !== undefined) {
        admins.value = admins.value.filter(
          id => !adminsToBeRemoved.includes(id)
        )
      } else {
        throw new Error('admins is empty')
      }
      toast.success('管理者を削除しました')
    } catch {
      toast.error('管理者の削除に失敗しました')
    } finally {
      isSending.value = false
    }
  }
  return { absentMembers, isSending, addAdmins, removeAdmins }
}
