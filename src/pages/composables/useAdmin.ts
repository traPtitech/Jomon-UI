import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'

import { useAdminStore } from '/@/stores/admin'
import { useUserStore } from '/@/stores/user'

import apis from '/@/lib/apis'

export const useAdmin = () => {
  const { users } = storeToRefs(useUserStore())
  const { admins } = storeToRefs(useAdminStore())

  const absentMembers = computed(() => {
    if (users.value !== undefined && admins !== undefined) {
      return users.value.filter(member => !admins.value?.includes(member.name)) //assertionしないでどうにかしたい
    } else {
      return []
    }
  })

  const isSending = ref(false)

  const addAdmins = async (adminsToBeAdded: string[]) => {
    if (adminsToBeAdded.length === 0) {
      alert('1人以上選択して下さい')
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
    } catch (err) {
      alert(err)
    } finally {
      isSending.value = false
    }
  }
  const removeAdmins = async (adminsToBeRemoved: string[]) => {
    if (adminsToBeRemoved.length === 0) {
      alert('1人以上選択して下さい')
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
    } catch (err) {
      alert(err)
    } finally {
      isSending.value = false
    }
  }
  return { absentMembers, isSending, addAdmins, removeAdmins }
}
