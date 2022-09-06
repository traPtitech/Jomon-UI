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

  const addAdmins = async (addList: string[]) => {
    if (addList.length === 0) {
      alert('1人以上選択して下さい')
      return
    }
    if (!confirm('本当に追加しますか？')) {
      return
    }
    try {
      isSending.value = true
      const res = (await apis.postAdmins(addList)).data
      if (admins.value !== undefined) {
        admins.value.push(...res)
      } else {
        admins.value = [res]
      }
    } catch (err) {
      alert(err)
    } finally {
      isSending.value = false
    }
  }
  const removeAdmins = async (removeList: string[]) => {
    if (removeList.length === 0) {
      alert('1人以上選択して下さい')
      return
    }
    if (!confirm('本当に削除しますか？')) {
      return
    }
    try {
      isSending.value = true
      await apis.deleteAdmins(removeList)
      if (admins.value !== undefined) {
        admins.value = admins.value.filter(id => !removeList.includes(id))
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
