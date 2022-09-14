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
    ownersToBeAdded: string[],
    emit: (e: 'fixGroup', group: GroupDetail) => void
  ) => {
    if (ownersToBeAdded.length === 0) {
      return
    }
    try {
      isSending.value = true
      await apis.postGroupOwners(group.id, ownersToBeAdded)
      const nextGroup = {
        ...group,
        owners: [...group.owners, ...ownersToBeAdded]
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
