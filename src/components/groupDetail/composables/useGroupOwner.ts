import { ref, computed } from 'vue'

import { useUserStore } from '/@/stores/user'

import type { GroupDetail } from '/@/lib/apis'
import apis from '/@/lib/apis'

export const useGroupOwner = (group: GroupDetail) => {
  const { users } = useUserStore()

  const absentOwners = computed(() => {
    if (users === undefined) {
      return []
    }
    return users.filter(member => !group.owners.includes(member.name))
  })

  const isSending = ref(false)

  const addOwners = async (
    owners: string[],
    emit: (e: 'fixGroup', group: GroupDetail) => void
  ) => {
    if (owners.length === 0) {
      return
    }
    try {
      isSending.value = true
      const res = (await apis.postGroupOwners(group.id, owners)).data
      const nextGroup = {
        ...group,
        owners: [...group.owners, ...res]
      }
      emit('fixGroup', nextGroup)
    } catch (err) {
      alert(err)
    } finally {
      isSending.value = false
    }
  }
  const removeOwner = async (
    id: string,
    emit: (e: 'fixGroup', group: GroupDetail) => void
  ) => {
    try {
      isSending.value = true
      await apis.deleteGroupOwners(group.id, [id])
      const nextGroup = {
        ...group,
        owners: group.owners.filter(owner => owner !== id)
      }
      emit('fixGroup', nextGroup)
    } catch (err) {
      alert(err)
    } finally {
      isSending.value = false
    }
  }
  return { absentOwners, isSending, addOwners, removeOwner }
}
